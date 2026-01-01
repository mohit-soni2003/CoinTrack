const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
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
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
