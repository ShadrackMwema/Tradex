const mongoose = require('mongoose');

const sellerApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  businessName: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  serviceCategory: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  quizAnswers: { type: Array, required: true },
  documents: {
    identificationDoc: { public_id: String, url: String },
    certificationDoc: { public_id: String, url: String },
    additionalDoc: { public_id: String, url: String },
  },
  status: { type: String, default: 'pending' },
  aiAnalysis: {
    riskScore: { type: Number },
    analysisResult: { type: String },
  },
  reviewNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SellerApplication', sellerApplicationSchema);