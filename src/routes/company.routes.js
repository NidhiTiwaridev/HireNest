const express = require("express");
const router = express.Router();

const { createCompany } = require("../controllers/company.controller");
const authMiddleware = require("../middleware/auth.middleware");

// only logged-in users can create company
router.post("/create", authMiddleware, createCompany);

module.exports = router;