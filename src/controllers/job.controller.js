const Job = require("../models/job.model");
const Company = require("../models/company.model");

// ===============================
// CREATE JOB
// ===============================
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      experience,
      skills,
      location,
      workMode,
      company,
    } = req.body;

    // check company exists
    const existingCompany = await Company.findById(company);

    if (!existingCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // create job
    const job = await Job.create({
      title,
      description,
      salary,
      experience,
      skills,
      location,
      workMode,
      company,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Job created successfully",
      job,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL JOBS
// ===============================
const getAllJobs = async (req, res) => {
  try {
    // Get query parameters
    const { keyword, location, workMode, page = 1, limit = 10 } = req.query;

    // Create query object
    let query = {};

    // Search by job title
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    // Filter by location
    if (location) {
      query.location = location;
    }

    // Filter by work mode
    if (workMode) {
      query.workMode = workMode;
    }

    // Count total matching jobs
    const totalJobs = await Job.countDocuments(query);

    // Fetch jobs with pagination
    const jobs = await Job.find(query)
      .populate("company")
      .populate("createdBy")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      message: "Jobs fetched successfully",
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      createdBy: req.user.id,
    }).populate("company");

    res.status(200).json({
      message: "My jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate("company")
      .populate("createdBy");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json({
      message: "Job fetched successfully",
      job,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
};