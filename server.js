const express = require("express");
require("dotenv").config();

const app = express();
console.log("🔥 SERVER FILE IS RUNNING");
const path = require("path");
// middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB connection
const connectDB = require("./src/config/database");
connectDB();
app.use(express.urlencoded({ extended: true }));

// routes
const userRoutes = require("./src/routes/user.routes");
const companyRoutes = require("./src/routes/company.routes");
const jobRoutes = require("./src/routes/job.routes");
const savedJobRoutes = require("./src/routes/savedJob.routes");
app.use("/api/auth", userRoutes);
app.use("/api/company",companyRoutes);
app.use("/api/job",jobRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
const applicationRoutes = require("./src/routes/application.routes");

app.use("/api/application", applicationRoutes);


// test route
app.get("/", (req, res) => {
  res.send("Job Portal API Running");
});
app.get("/test", (req, res) => {
  res.send("SERVER WORKING");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});