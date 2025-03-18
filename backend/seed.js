const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
const Product = require("./model/product");
const Shop = require("./model/shop");
const dotenv = require("dotenv");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to uncaught exception.");
});

// Load environment variables (only in development mode)
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "config/.env" });
}

// Connect to Database
connectDatabase();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const seedProducts = async () => {
  try {
    console.log("⚡ Starting Seeding Process...");

    // Ensure a shop exists
    const shop = await Shop.findOne();
    if (!shop) {
      console.log("❌ No shop found! Please add a shop first.");
      process.exit(1);
    }

    // Sample Images (Replace with real URLs or local files)
    const images = [
      "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D/",
      "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D/",
      "https://plus.unsplash.com/premium_photo-1664202526559-e21e9c0fb46a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D/",
    ];

    let uploadedImages = [];

    // Upload images to Cloudinary
    for (const url of images) {  // ✅ FIXED VARIABLE NAME
      const result = await cloudinary.uploader.upload(url, {
        folder: "products",
      });
      uploadedImages.push({ public_id: result.public_id, url: result.secure_url });
    }

    // Sample Product Data
    const products = [
      {
        name: "Fashion Design Consultation",
        description: "👗✨ Get expert fashion advice tailored to your needs.",
        category: "cosmetics and body care",
        tags: "fashion, design",
        originalPrice: 998,
        discountPrice: 850,
        stock: 5,
        images: uploadedImages,
        shopId: shop._id,
        shop: shop,
      },
      {
        name: "Stylish Men's Suit",
        description: "👔 Premium men's suit perfect for any occasion.",
        category: "clothing",
        tags: "fashion, design",
        originalPrice: 2500,
        discountPrice: 2200,
        stock: 3,
        images: uploadedImages,
        shopId: shop._id,
        shop: shop,
      },
    ];

    // Insert into DB
    await Product.insertMany(products);
    console.log("✅ Products Seeded Successfully!");

    // Exit process after completion
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding Failed! Error: ${error.message}`);
    process.exit(1);
  }
};

// Run Seeder
seedProducts();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down due to unhandled rejection: ${err.message}`);
  process.exit(1);
});
