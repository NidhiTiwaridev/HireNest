const SavedJob = require("../models/savedJob.model");
const Job = require("../models/job.model");

// ===============================
// SAVE JOB
// ===============================
const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Prevent duplicate save
    const alreadySaved = await SavedJob.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (alreadySaved) {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    // Save job
    const savedJob = await SavedJob.create({
      user: req.user.id,
      job: jobId,
    });

    return res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// GET SAVED JOBS
// ===============================
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      user: req.user.id,
    }).populate({
      path: "job",
      populate: {
        path: "company",
      },
    });

    return res.status(200).json({
      message: "Saved jobs fetched successfully",
      savedJobs,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ===============================
// REMOVE SAVED JOB
// ===============================
const removeSavedJob = async (req, res) => {
  try {
    const { id } = req.params;

    const savedJob = await SavedJob.findById(id);

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found",
      });
    }

    // Check ownership
    if (savedJob.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    await savedJob.deleteOne();

    return res.status(200).json({
      message: "Saved job removed successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob,
};