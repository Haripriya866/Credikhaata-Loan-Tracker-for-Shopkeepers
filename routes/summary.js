const express = require("express");
const router = express.Router();
const { getLoanSummary, getOverdueLoans } = require("../controllers/summaryController");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/summary", getLoanSummary);
router.get("/overdue", getOverdueLoans);

module.exports = router;
