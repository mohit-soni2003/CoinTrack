const Expense = require("../models/expense");
const Family = require("../models/family");
const User = require("../models/user");
const Transaction = require("../models/transaction");

/**
 * POST /api/expense
 * Add a new expense for logged-in user
 *
 * Required body:
 * - title {string} - expense title (max 100 chars, non-empty)
 * - amount {number} - positive amount in decimal
 * - category {string} - one of predefined categories
 * - date {date} (optional) - expense date, defaults to now
 *
 * Auth: Required (JWT)
 * Response: 201 with created expense object
 * Errors: 400 (validation), 500 (DB error)
 */
exports.addExpense = async (req, res) => {
  try {
    let { title, amount, category, date } = req.body;

    // Validate required fields
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Title is required and must be a non-empty string"
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a positive number"
      });
    }

    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        message: "Category is required and must be a non-empty string"
      });
    }

    // Sanitize and trim inputs
    title = title.trim().substring(0, 100);
    category = category.trim();
    amount = Number(amount).toFixed(2);

    // Validate date format if provided
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid date format"
        });
      }
      date = parsedDate;
    } else {
      date = new Date();
    }



    // Validate category against Expense model enum
    const validCategories = [
      "Groceries", "Vegetables", "Milk", "Fruits", "Bakery", "DiningOut", "Snacks",
      "Fuel", "PublicTransport", "Cab", "VehicleMaintenance", "Parking", "Toll",
      "Rent", "Electricity", "Water", "Gas", "Internet", "MobileRecharge", "Maintenance", "HouseHelp",
      "Clothing", "Footwear", "Electronics", "Furniture", "OnlineShopping",
      "Doctor", "Medicine", "Hospital", "HealthInsurance",
      "SchoolFees", "CollegeFees", "Books", "Coaching", "OnlineCourses",
      "Entertainment", "Movies", "Subscriptions", "Gym", "Salon", "PersonalCare",
      "EMI", "LoanRepayment", "Insurance", "Tax",
      "Gifts", "Donations", "Functions", "Festivals",
      "Miscellaneous"
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${validCategories.join(", ")}`
      });
    }

    // Create expense (familyId is optional)
    const expenseData = {
      title,
      amount,
      category,
      date,
      memberId: req.user._id
    };
    // Only add familyId if user belongs to a family
    if (req.user.familyId) {
      expenseData.familyId = req.user.familyId;
    }

    const expense = await Expense.create(expenseData);

    // Decrement user's balance and create transaction record
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { balance: -amount } },
        { new: true }
      );

      // Decrement family balance if user belongs to a family
      if (expense.familyId) {
        await Family.findByIdAndUpdate(
          expense.familyId,
          { $inc: { balance: -amount } },
          { new: true }
        );
      }

      // Create transaction snapshot
      await Transaction.create({
        type: "expense",
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        relatedId: expense._id,
        balanceAfter: user.balance,
        memberId: expense.memberId,
        familyId: expense.familyId,
        date: expense.date
      });
    } catch (txErr) {
      console.error("Warning: failed to update user balance or create transaction:", txErr);
      // Don't fail the request, but log the error
    }

    res.status(201).json({
      message: "Expense added successfully",
      expense: {
        id: expense._id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        memberId: expense.memberId,
        familyId: expense.familyId
      }
    });

  } catch (error) {
    console.error("Add Expense Error:", error);

    // Handle specific Mongoose errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        details: Object.values(error.errors).map(e => e.message)
      });
    }

    res.status(500).json({
      message: "Failed to add expense",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

/**
 * GET /api/expense
 * Get all expenses for logged-in user
 *
 * Query params (optional):
 * - limit {number} - number of expenses per page (default: 50)
 * - skip {number} - number of expenses to skip (default: 0)
 * - category {string} - filter by category
 *
 * Auth: Required (JWT)
 * Response: 200 with array of expenses
 */
exports.getExpenses = async (req, res) => {
  try {
    const { limit = 50, skip = 0, category } = req.query;

    // Build filter query
    const filter = {
      memberId: req.user._id
    };

    // Optional category filter
    if (category && category.trim() !== "") {
      filter.category = category.trim();
    }

    // Fetch expenses
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .select("title amount category date memberId familyId");

    // Get total count for pagination
    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      message: "Expenses fetched successfully",
      data: expenses,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);
    res.status(500).json({
      message: "Failed to fetch expenses",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
