const Loan = require("../models/Loan");
const moment = require("moment");

// Get overall loan summary for the user
exports.getLoanSummary = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id });

    const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);

    const totalCollected = loans.reduce(
      (sum, loan) =>
        sum + loan.repayments.reduce((innerSum, repayment) => innerSum + repayment.amount, 0),
      0
    );

    const overdueAmount = loans.reduce((sum, loan) => {
      const isOverdue =
        loan.status !== "paid" && moment().isAfter(moment(loan.dueDate));
      const loanRepaid = loan.repayments.reduce((rSum, r) => rSum + r.amount, 0);
      return isOverdue ? sum + (loan.amount - loanRepaid) : sum;
    }, 0);

    const avgRepaymentTime = (() => {
      const durations = loans
        .filter(loan => loan.status === "paid" && loan.repayments.length > 0)
        .map(loan => {
          const lastRepaymentDate = loan.repayments[loan.repayments.length - 1].date;
          return moment(lastRepaymentDate).diff(moment(loan.issueDate), "days");
        });

      const totalDays = durations.reduce((sum, days) => sum + days, 0);
      return durations.length ? (totalDays / durations.length).toFixed(1) : 0;
    })();

    return res.status(200).json({
      success: true,
      message: "Loan summary fetched successfully.",
      data: {
        totalLoaned,
        totalCollected,
        overdueAmount,
        avgRepaymentTime,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch loan summary.",
      error: error.message,
    });
  }
};

// Get all overdue loans for the user
exports.getOverdueLoans = async (req, res) => {
  try {
    const overdueLoans = await Loan.find({
      user: req.user._id,
      status: { $ne: "paid" },
      dueDate: { $lt: new Date() },
    }).populate("customer");

    return res.status(200).json({
      success: true,
      message: "Overdue loans fetched successfully.",
      data: overdueLoans.map(loan => ({
        ...loan.toObject(),
        status: "overdue", // override status only for response
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch overdue loans.",
      error: error.message,
    });
  }
};
