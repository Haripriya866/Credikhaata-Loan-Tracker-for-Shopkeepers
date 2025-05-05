const Loan = require("../models/Loan");

// Create a new loan
exports.createLoan = async (req, res) => {
  try {
    const newLoan = new Loan({ ...req.body, user: req.user._id });
    await newLoan.save();

    return res.status(201).json({
      success: true,
      message: "Loan created successfully.",
      data: newLoan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to create loan.",
      error: error.message,
    });
  }
};

// Get all loans for the logged-in user
exports.getLoans = async (req, res) => {
  try {
    const userLoans = await Loan.find({ user: req.user._id }).populate("customer");

    return res.status(200).json({
      success: true,
      message: "Loans fetched successfully.",
      data: userLoans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve loans.",
      error: error.message,
    });
  }
};
