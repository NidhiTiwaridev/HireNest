const Company = require("../models/company.model");

// CREATE COMPANY
const createCompany = async (req, res) => {
  try {
    const { name, description, website, logo, location } = req.body;

    // 1. check duplicate company
    const existingCompany = await Company.findOne({ name });

    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists",
      });
    }

    // 2. create company
    const company = await Company.create({
      name,
      description,
      website,
      logo,
      location,
      createdBy: req.user.id, // from middleware
    });

    // 3. response
    return res.status(201).json({
      message: "Company created successfully",
      company,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createCompany };