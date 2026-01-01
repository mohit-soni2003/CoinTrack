const mongoose = require("mongoose");

const familySchema = new mongoose.Schema(
  {
    familyName: {
      type: String,
      required: true
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // A short, human-friendly family identifier used for member signup
    familyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    balance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Family", familySchema);
