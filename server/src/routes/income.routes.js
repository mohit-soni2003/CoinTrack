const express = require("express");
const router = express.Router();

const { addIncome } = require("../controllers/income.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Add income
router.post("/", authMiddleware, addIncome);

module.exports = router;
