const Loan = require("../models/Loan");
const mongoose = require("mongoose");

exports.recordRepayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(loanId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid loanId format.",
        });
      }

    const loan = await Loan.findOne({ _id: loanId, user: req.user._id });
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found.",
      });
    }

    loan.repayments.push({ amount, date });

    const totalRepaid = loan.repayments.reduce((sum, r) => sum + r.amount, 0);
    loan.status = totalRepaid >= loan.amount ? "paid" : "pending";

    await loan.save();

    return res.status(200).json({
      success: true,
      message: "Repayment recorded successfully.",
      data: loan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to record repayment.",
      error: error.message,
    });
  }
};
