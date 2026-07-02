const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  saveJob,
  getSavedJobs,
  removeSavedJob,
} = require("../controllers/savedJob.controller");

// Save Job
router.post("/", authMiddleware, saveJob);

// Get Saved Jobs
router.get("/", authMiddleware, getSavedJobs);

// Remove Saved Job
router.delete("/:id", authMiddleware, removeSavedJob);

module.exports = router;