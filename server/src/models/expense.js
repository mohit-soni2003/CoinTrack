const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            enum: [
                // Food
                "Groceries",
                "Vegetables",
                "Milk",
                "Fruits",
                "Bakery",
                "DiningOut",
                "Snacks",

                // Transport
                "Fuel",
                "PublicTransport",
                "Cab",
                "VehicleMaintenance",
                "Parking",
                "Toll",

                // Home & Utilities
                "Rent",
                "Electricity",
                "Water",
                "Gas",
                "Internet",
                "MobileRecharge",
                "Maintenance",
                "HouseHelp",

                // Shopping
                "Clothing",
                "Footwear",
                "Electronics",
                "Furniture",
                "OnlineShopping",

                // Health
                "Doctor",
                "Medicine",
                "Hospital",
                "HealthInsurance",

                // Education
                "SchoolFees",
                "CollegeFees",
                "Books",
                "Coaching",
                "OnlineCourses",

                // Lifestyle
                "Entertainment",
                "Movies",
                "Subscriptions",
                "Gym",
                "Salon",
                "PersonalCare",

                // Financial
                "EMI",
                "LoanRepayment",
                "Insurance",
                "Tax",

                // Social
                "Gifts",
                "Donations",
                "Functions",
                "Festivals",

                // Other
                "Miscellaneous"
            ],
            default: "Miscellaneous",
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        familyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Family",
            required: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
