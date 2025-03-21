const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { timestamp } = req.body;

      // Validate the timestamp
      const requestTime = new Date(timestamp);
      const currentTime = new Date();
      const timeDifference = Math.abs(currentTime - requestTime) / (1000 * 60); // Difference in minutes

      console.log("Received timestamp:", timestamp); // Log the received timestamp
      console.log("Server current time:", currentTime.toISOString()); // Log the server's current time
      console.log("Time difference (minutes):", timeDifference); // Log the time difference

      if (isNaN(requestTime.getTime()) || timeDifference > 120) { // Allow up to 2 hours
        return next(
          new ErrorHandler(
            "Stale request - reported time is invalid or more than 2 hours ago",
            400
          )
        );
      }

      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      const imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const productData = req.body;
      productData.images = imagesLinks;
      productData.shop = shop;
      productData.sellerLocation = shop.address;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error); // Log the full error object
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        return next(new ErrorHandler(messages.join(", "), 400)); // Return detailed validation errors
      }
      return next(new ErrorHandler(error.message || "Invalid request data", 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { location } = req.query; // Get location from query params

      // Get all unique seller locations for the dropdown
      const allLocations = await Product.distinct("sellerLocation");
      // console.log("Raw locations from DB:", allLocations);
      
      const validLocations = allLocations.filter(loc => loc !== null && loc !== undefined);
      // console.log("Valid locations after filtering:", validLocations);
      // console.log("Raw locations from DB:", allLocations);
      // Query products based on location filter
      let products;
      if (location && location !== "All Locations") {
        products = await Product.find({ sellerLocation: location }).sort({
          createdAt: -1,
        });
      } else {
        products = await Product.find().sort({ createdAt: -1 });
      }
      // console.log("Number of products found:", products.length);
      // Log a sample of sellerLocation values from the first few products
      // if (products.length > 0) {
      //   console.log("Sample sellerLocation values:", 
      //     products.slice(0, Math.min(5, products.length)).map(p => p.sellerLocation));
      // }
      res.status(200).json({
        success: true,
        products,
        locations: ["All Locations", ...validLocations]
      });
    } catch (error) {
      console.error("Error in get-all-products:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      for (let i = 0; 1 < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      }
      await product.remove();
      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products with filtering and location options
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { location } = req.query; // Get location from query params

      // Get all unique seller locations for the dropdown
      const allLocations = await Product.distinct("sellerLocation");
      const validLocations = allLocations.filter(
        (loc) => loc !== null && loc !== undefined
      );

      // Query products based on location filter
      let products;
      if (location && location !== "All Locations") {
        products = await Product.find({ sellerLocation: location }).sort({
          createdAt: -1,
        });
      } else {
        products = await Product.find().sort({ createdAt: -1 });
      }

      res.status(200).json({
        success: true,
        products,
        locations: ["All Locations", ...validLocations],
      });
    } catch (error) {
      console.error("Error in get-all-products:", error); // Log the error
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;
      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;
      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;

      const products = await Product.find({ shopId: id }).sort({
        createdAt: -1,
      });

      if (!products) {
        return next(new ErrorHandler("No products found for this shop", 404));
      }

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error fetching products for shop:", error); // Log error
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
