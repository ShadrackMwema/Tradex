const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const SellerApplication  = require("../model/application"); // Import the model
const mongoose =require("mongoose")
// Configure Multer
const storage = multer.diskStorage({});
const upload = multer({ storage });


// Seller Application Submission
router.post(
  "/application",
  upload.fields([
    { name: "identificationDoc", maxCount: 1 },
    { name: "certificationDoc", maxCount: 1 },
    { name: "additionalDoc", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {userId, businessName, contactEmail, phoneNumber, serviceCategory, experienceYears } = req.body;
      const quizAnswers = JSON.parse(req.body.quizAnswers);

      // Upload files to Cloudinary
      const documents = {};
if (req.files.identificationDoc) {
  const result = await cloudinary.v2.uploader.upload(req.files.identificationDoc[0].path, { folder: "documents" });
  documents.identificationDoc = { public_id: result.public_id, url: result.secure_url };
}
if (req.files.certificationDoc) {
  const result = await cloudinary.v2.uploader.upload(req.files.certificationDoc[0].path, { folder: "documents" });
  documents.certificationDoc = { public_id: result.public_id, url: result.secure_url };
}
if (req.files.additionalDoc) {
  const result = await cloudinary.v2.uploader.upload(req.files.additionalDoc[0].path, { folder: "documents" });
  documents.additionalDoc = { public_id: result.public_id, url: result.secure_url };
}
      // Create new application
      const newApplication = new SellerApplication({
        userId,
        businessName,
        contactEmail,
        phoneNumber,
        serviceCategory,
        experienceYears,
        quizAnswers,
        documents,
        status: "pending",
      });

      await newApplication.save();

   
      res.status(201).json({ message: "Application submitted successfully", applicationId: newApplication._id });
    } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  }
);

// Get seller application status
router.get("/application/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Log the ID for debugging
      // console.log("Fetching application with ID:", id);
  
      // Validate the ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }
  
      const application = await SellerApplication.findById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });
  // Get applications by userId
router.get("/user-applications", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const applications = await SellerApplication.find({ userId });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "Failed to fetch user applications" });
  }
});
  
// Admin Routes

// Get all applications (filtered by status)
router.get("/seller-applications", async (req, res) => {
  try {
    const { status = "pending" } = req.query;
    const applications = await SellerApplication.find({ status })
      .select("businessName serviceCategory createdAt aiAnalysis.riskScore")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// Get specific application details
router.get("/seller-applications/:id", async (req, res) => {
  try {
    const application = await SellerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).json({ message: "Failed to fetch application details" });
  }
});

// Get AI analysis for an application
router.get("/seller-applications/:id/ai-analysis", async (req, res) => {
  try {
    const application = await SellerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!application.aiAnalysis || !application.aiAnalysis.riskScore) {
      return res.status(404).json({ message: "AI analysis not available yet" });
    }

    res.json(application.aiAnalysis);
  } catch (error) {
    console.error("Error fetching AI analysis:", error);
    res.status(500).json({ message: "Failed to fetch AI analysis" });
  }
});

// Approve application
router.put("/seller-applications/:id/approve", async (req, res) => {
  try {
    const { reviewNotes } = req.body;

    const application = await SellerApplication.findByIdAndUpdate(
      req.params.id,
      { status: "approved", reviewNotes, updatedAt: Date.now() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application approved successfully", application });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ message: "Failed to approve application" });
  }
});

// Reject application
router.put("/seller-applications/:id/reject", async (req, res) => {
  try {
    const { reviewNotes } = req.body;

    const application = await SellerApplication.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", reviewNotes, updatedAt: Date.now() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application rejected", application });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: "Failed to reject application" });
  }
});

// Request more information
router.put("/seller-applications/:id/request-info", async (req, res) => {
  try {
    const { reviewNotes } = req.body;

    const application = await SellerApplication.findByIdAndUpdate(
      req.params.id,
      { status: "more-info", reviewNotes, updatedAt: Date.now() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "More information requested", application });
  } catch (error) {
    console.error("Error requesting more information:", error);
    res.status(500).json({ message: "Failed to request more information" });
  }
});

module.exports = router;
