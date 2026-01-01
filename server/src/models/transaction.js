const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true
    },

    // snapshot fields (copy of expense/income details at time of transaction)
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String },

    // optional reference to original document
    relatedId: {
      type: mongoose.Schema.Types.ObjectId
    },

    // account balance after this transaction
    balanceAfter: {
      type: Number,
      required: true
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
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
