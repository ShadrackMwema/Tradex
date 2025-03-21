const Product = require("../model/product");

exports.createProduct = async (req, res) => {
  try {
    console.log("Request body received:", req.body); // Log the full request body
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error); // Log the full error object
    if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      const messages = Object.values(error.errors).map((val) => val.message);
      res.status(400).json({
        success: false,
        message: messages.join(", "), // Combine all validation error messages
      });
    } else {
      res.status(400).json({
        success: false,
        message: error.message || "Invalid request data",
      });
    }
  }
};