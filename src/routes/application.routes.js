const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const {
  applyJob,
  getMyApplications,
  getAllApplications,
  getApplicationsByJob,
  updateApplicationStatus,
} = require("../controllers/application.controller");

const authMiddleware = require("../middleware/auth.middleware");

// apply for job
router.post(
  "/apply",
  authMiddleware,
  upload.single("resume"),
  applyJob
);

// user applications
router.get("/my", authMiddleware, getMyApplications);

// recruiter/admin view all
router.get("/all", authMiddleware, getAllApplications);
router.get("/job/:jobId", authMiddleware, getApplicationsByJob);
router.patch(
  "/status/:id",
  authMiddleware,
  updateApplicationStatus
);

module.exports = router;