const Income = require("../models/income");
const User = require("../models/user");
const Family = require("../models/family");
const Transaction = require("../models/transaction");

/**
 * POST /api/income
 * Add income for logged-in user and update balance
 */
exports.addIncome = async (req, res) => {
  try {
    const { title, amount, date } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    if (!req.user.familyId) {
      return res.status(400).json({ message: "User is not associated with any family" });
    }

    const income = await Income.create({
      title,
      amount,
      date: date || new Date(),
      memberId: req.user._id,
      familyId: req.user.familyId
    });

    // increment user's balance and create transaction
    try {
      const user = await User.findById(req.user._id);
      user.balance = (user.balance || 0) + Number(amount);
      await user.save();

      // Increment family balance
      await Family.findByIdAndUpdate(
        req.user.familyId,
        { $inc: { balance: Number(amount) } },
        { new: true }
      );

      await Transaction.create({
        type: "income",
        title: income.title,
        amount: income.amount,
        category: undefined,
        relatedId: income._id,
        balanceAfter: user.balance,
        memberId: income.memberId,
        familyId: income.familyId,
        date: income.date
      });
    } catch (err) {
      console.error("Warning: failed to update user balance or create transaction after income:", err);
    }

    res.status(201).json({ message: "Income added successfully", income });
  } catch (error) {
    console.error("Add Income Error:", error);
    res.status(500).json({ message: "Failed to add income" });
  }
};
