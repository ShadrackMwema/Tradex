const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["purchase", "spend", "refund", "gift", "other"],
      required: true,
    },
    amount: {
      type: Number,
      required: true, // coin amount
    },
    paymentAmount: {
      type: Number, // actual money amount in USD
    },
    paymentId: {
      type: String, // Stripe payment intent ID or other reference
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    packageType: {
      type: String, // small, medium, large
    },
    description: {
      type: String,
    },
    metadata: {
      type: Object, // For any additional data
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);