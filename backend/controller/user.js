const express = require("express");
const User = require("../model/user");
const Product = require("../model/product"); // You'll need to create this model
const Transaction = require("../model/Transaction"); // You'll need to create this model
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create user
router.post("/create-user", async (req, res, next) => {
  try {
    console.log("Starting user creation process");
    const { name, email, password, avatar } = req.body;
    console.log(`Received request for email: ${email}`);

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    console.log("Attempting to upload to Cloudinary");
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    console.log("Cloudinary upload successful");

    const user = {
      name: name,
      email: email,
      password: password,
      coins: 50, // Starting with 50 coins for new users
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };

    console.log("Creating activation token");
    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    console.log("Sending activation email");
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      console.log("Email sent successfully");

      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    console.error("User creation failed:", error);
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, coins } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
        coins: coins || 50, // Ensure coins are set, default to 50
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.get(
  "/getuser/:userId",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId); // Use req.params.userId
      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsUser = await User.findById(req.user.id);
      if (req.body.avatar !== "") {
        const imageId = existsUser.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
        });

        existsUser.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await existsUser.save();

      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exists`)
        );
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );

      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("Password doesn't matched with each other!", 400)
        );
      }
      user.password = req.body.newPassword;

      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user information with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      const imageId = user.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// NEW ROUTES FOR COIN SYSTEM

// Get user's coin balance
router.get(
  "/get-coin-balance",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      
      res.status(200).json({
        success: true,
        coins: user.coins
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Purchase coins (add coins to user's account)
router.post(
  "/purchase-coins",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { packageType, paymentDetails } = req.body;
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      
      // Coin package options
      const coinPackages = {
        small: { coins: 100, price: 5 },
        medium: { coins: 300, price: 12 },
        large: { coins: 500, price: 18 }
      };
      
      // Validate package type
      if (!coinPackages[packageType]) {
        return next(new ErrorHandler("Invalid package type", 400));
      }
      
      // Process payment (integrate with your payment gateway)
      // This is a placeholder - you'll need to implement the actual payment processing
      
      // After successful payment, add coins to user's account
      user.coins += coinPackages[packageType].coins;
      await user.save();
      
      res.status(200).json({
        success: true,
        message: `${coinPackages[packageType].coins} coins added to your account`,
        newBalance: user.coins
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// View service provider full details (spend coins)
router.post(
  "/view-service-provider/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const serviceProviderId = req.params.id;
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      
      // Find the service provider
      const serviceProvider = await Product.findById(serviceProviderId);
      
      if (!serviceProvider) {
        return next(new ErrorHandler("Service provider not found", 404));
      }
      
      // Check if user already purchased access to this service provider
      const existingTransaction = await Transaction.findOne({
        user: user._id,
        serviceProvider: serviceProviderId
      });
      
      if (existingTransaction) {
        // User already has access
        return res.status(200).json({
          success: true,
          serviceProvider,
          alreadyPurchased: true
        });
      }
      
      // Check if user has enough coins
      if (user.coins < serviceProvider.coinCost) {
        return res.status(403).json({
          success: false,
          message: "Not enough coins",
          required: serviceProvider.coinCost,
          available: user.coins
        });
      }
      
      // Deduct coins and create transaction
      user.coins -= serviceProvider.coinCost;
      
      // Create transaction record
      const transaction = await Transaction.create({
        user: user._id,
        serviceProvider: serviceProviderId,
        coinsSpent: serviceProvider.coinCost,
        timestamp: Date.now()
      });
      
      // Update user transaction history if your schema has that field
      if (!user.transactions) {
        user.transactions = [];
      }
      user.transactions.push(transaction._id);
      
      await user.save();
      
      res.status(200).json({
        success: true,
        serviceProvider,
        newCoinsBalance: user.coins,
        message: `${serviceProvider.coinCost} coins spent to view details`
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get user's transaction history
router.get(
  "/transaction-history",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Find all transactions for this user with populated service provider details
      const transactions = await Transaction.find({ user: req.user.id })
        .populate("serviceProvider", "name description coinCost")
        .sort({ timestamp: -1 });
      
      res.status(200).json({
        success: true,
        transactions
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Award bonus coins (admin only)
router.post(
  "/award-coins/:userId",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount, reason } = req.body;
      const user = await User.findById(req.params.userId);
      
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      
      // Add coins to user's balance
      user.coins += parseInt(amount);
      await user.save();
      
      res.status(200).json({
        success: true,
        message: `${amount} coins awarded to ${user.name}`,
        reason
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;