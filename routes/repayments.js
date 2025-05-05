const express = require("express");
const router = express.Router();
const { recordRepayment } = require("../controllers/repaymentController");
const auth = require("../middleware/auth");

router.use(auth);

router.post("/:loanId", recordRepayment);

module.exports = router;
