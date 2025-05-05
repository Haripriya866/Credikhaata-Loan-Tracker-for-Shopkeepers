const express = require("express");
const router = express.Router();
const { createLoan, getLoans } = require("../controllers/loanController");
const auth = require("../middleware/auth");

router.use(auth);

router.post("/", createLoan);
router.get("/", getLoans);

module.exports = router;
