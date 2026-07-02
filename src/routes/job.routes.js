const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,getMyJobs
} = require("../controllers/job.controller");

const authMiddleware = require("../middleware/auth.middleware");

// create job (protected)
router.post("/create",authMiddleware,  createJob);

// get all jobs (public)
router.get("/all", getAllJobs);
router.get("/my", authMiddleware, getMyJobs);
router.get("/test", (req, res) => {
  res.send("JOB ROUTE WORKING");
});


module.exports = router;