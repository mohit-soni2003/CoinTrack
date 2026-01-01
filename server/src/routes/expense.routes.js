const express = require("express");
const router = express.Router();

const { addExpense, getExpenses } = require("../controllers/expense.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { validateAddExpense } = require("../validations/expense.validations");

/**
 * GET /api/expense
 * Fetch all expenses for logged-in user
 * Protected: Requires valid JWT token
 */
router.get("/", authMiddleware, getExpenses);

/**
 * POST /api/expense
 * Add a new expense for logged-in user
 * Protected: Requires valid JWT token
 */
router.post("/", authMiddleware, (req, res, next) => {
  // Validate payload before passing to controller
  const validation = validateAddExpense(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.error });
  }
  next();
}, addExpense);

module.exports = router;
