const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    description: String,
    amount: Number,
    issueDate: Date,
    dueDate: Date,
    frequency: String,
    interestPercent: Number,
    graceDays: Number,
    status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    repayments: [
      {
        amount: Number,
        date: Date,
      },
    ],
  });
  module.exports = mongoose.model("Loan", loanSchema);