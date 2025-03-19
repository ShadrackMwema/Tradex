const express = require("express");
const router = express.Router();
const User = require("../model/user");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Transaction = require("../model/Transaction"); // Make sure path is correct

// Get user's coin balance
router.get("/balance", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ coins: user.coins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase coins
router.post("/purchase", isAuthenticated, async (req, res) => {
  try {
    console.log("Purchase request received:", req.body);
    console.log("User making request:", req.user);

    const { amount, paymentMethodId } = req.body;

    const coinPackages = {
      small: { coins: 100, price: 5 },
      medium: { coins: 300, price: 12 },
      large: { coins: 500, price: 18 },
    };

    console.log("Selected package:", amount, coinPackages[amount]);

    const packageDetails = coinPackages[amount];
    if (!packageDetails)
      return res.status(400).json({ message: "Invalid package" });

    // Debug point 1 - Before Stripe
    console.log("About to create payment intent");

    // Process payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: packageDetails.price * 100, // cents
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });

    // Debug point 2 - After Stripe
    console.log("Payment intent status:", paymentIntent.status);

    if (paymentIntent.status === "succeeded") {
      // Add coins to user's account
      const user = await User.findById(req.user.id);
      console.log("Found user:", user ? "yes" : "no");

      // Create transaction record
      const transaction = new Transaction({
        user: user._id,
        type: 'purchase',
        amount: packageDetails.coins,
        paymentAmount: packageDetails.price,
        paymentId: paymentIntent.id,
        status: 'completed',
        packageType: amount,
        metadata: {
          paymentMethod: paymentMethodId,
          stripePaymentIntent: paymentIntent.id
        }
      });
      
      await transaction.save();
      console.log("Transaction recorded:", transaction._id);
      
      // Update user balance
      user.coins += packageDetails.coins;
      
      // Add transaction reference to user's transactions array (if your User model has this)
      if (Array.isArray(user.transactions)) {
        user.transactions.push(transaction._id);
      }
      
      await user.save();
      console.log("User coins updated to:", user.coins);

      res.json({
        success: true,
        message: `Added ${packageDetails.coins} coins to your account`,
        newBalance: user.coins,
        transactionId: transaction._id
      });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error in coin purchase:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/transactions", isAuthenticated, async (req, res) => {
  try {
    // Fetch all transactions and populate the 'user' field
    const transactions = await Transaction.find({})
      .populate("user", "username email") // Include only username and email from the User model
      .sort({ createdAt: -1 }); // Sort by most recent transactions first

    // Send the transactions as a JSON response
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/my-transactions", isAuthenticated, async (req, res) => {
  try {
    // Fetch transactions for the logged-in user
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // Sort by most recent transactions first

    // Send the transactions as a JSON response
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/deduct-coins", isAuthenticated, async (req, res) => {
  try {
    const { userId, coins } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.coins < coins) {
      return res.status(400).json({ message: "Insufficient coins" });
    }

    user.coins -= coins;
    await user.save();

    res.status(200).json({ success: true, message: "Coins deducted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;