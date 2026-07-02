const Application = require("../models/application.model");
const Job = require("../models/job.model");

// ===============================
// APPLY TO JOB
// ===============================
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // 1. check job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // 2. prevent duplicate application
    const alreadyApplied = await Application.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied to this job",
      });
    }

    // 3. create application
    const application = await Application.create({
      user: req.user.id,
      job: jobId,
      company: job.company,
      resume: req.file ? req.file.path : "",
    });

    return res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===============================
// GET USER APPLICATIONS
// ===============================
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user.id,
    })
      .populate("job")
      .populate("company");

    return res.status(200).json({
      message: "My applications fetched",
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL APPLICATIONS (RECRUITER)
// ===============================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user")
      .populate("job")
      .populate("company");

    return res.status(200).json({
      message: "All applications fetched",
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===============================
// GET APPLICATIONS FOR A JOB
// ===============================
const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({
      job: jobId,
    })
      .populate("user")
      .populate("job")
      .populate("company");

    res.status(200).json({
      message: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    // Step 1: Get application id from URL
    const { id } = req.params;

    // Step 2: Get new status from request body
    const { status } = req.body;

    // Step 3: Check if status is valid
    const allowedStatus = [
      "pending",
      "reviewed",
      "accepted",
      "rejected",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Step 4: Find the application
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    // Step 5: Find the related job
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Step 6: Check if logged-in recruiter owns this job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: You are not allowed to update this application",
      });
    }

    // Step 7: Update status
    application.status = status;

    // Step 8: Save changes
    await application.save();

    // Step 9: Send success response
    return res.status(200).json({
      message: "Application status updated successfully",
      application,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  applyJob,
  getMyApplications,
  getAllApplications,
  getApplicationsByJob,
  updateApplicationStatus,
};