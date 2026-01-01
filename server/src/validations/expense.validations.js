/**
 * Expense validation utilities
 */

const VALID_CATEGORIES = [
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

/**
 * Validate expense creation payload
 * @returns {object} { valid: boolean, error?: string }
 */
exports.validateAddExpense = (body) => {
  const { title, amount, category, date } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return { valid: false, error: "Title is required and must be a non-empty string" };
  }

  if (title.trim().length > 100) {
    return { valid: false, error: "Title must not exceed 100 characters" };
  }

  if (typeof amount !== "number" || amount <= 0) {
    return { valid: false, error: "Amount must be a positive number" };
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    return { valid: false, error: "Category is required" };
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return { valid: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` };
  }

  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return { valid: false, error: "Invalid date format" };
    }
  }

  return { valid: true };
};

exports.VALID_CATEGORIES = VALID_CATEGORIES;
