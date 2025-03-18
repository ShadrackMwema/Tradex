// src/components/SellerVerification/SellerApplicationForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellerApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    contactEmail: '',
    phoneNumber: '',
    serviceCategory: '',
    experienceYears: '',
    quizAnswers: {},
  });
  const [documents, setDocuments] = useState({
    identificationDoc: null,
    certificationDoc: null,
    additionalDoc: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample quiz questions - in production, these would come from your backend
  const quizQuestions = [
    { id: 'q1', question: 'What is your primary area of expertise?', type: 'text' },
    { id: 'q2', question: 'How many years have you been providing this service?', type: 'number' },
    { id: 'q3', question: 'Describe your quality assurance process.', type: 'textarea' },
    { id: 'q4', question: 'What sets your service apart from competitors?', type: 'textarea' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuizChange = (questionId, answer) => {
    setFormData({
      ...formData,
      quizAnswers: { ...formData.quizAnswers, [questionId]: answer },
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments({ ...documents, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create FormData for file uploads
      const formDataForUpload = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'quizAnswers') {
          formDataForUpload.append(key, JSON.stringify(formData[key]));
        } else {
          formDataForUpload.append(key, formData[key]);
        }
      });
      
      // Add files
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formDataForUpload.append(key, documents[key]);
        }
      });

      // Submit to backend
      const response = await axios.post('/api/seller/application', formDataForUpload);
      
      // Redirect to pending status page
      navigate('/seller/application-status', { state: { applicationId: response.data.applicationId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Seller Verification Application</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Business Information</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Service Category</label>
            <select
              name="serviceCategory"
              value={formData.serviceCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              <option value="digital">Digital Services</option>
              <option value="design">Design & Creative</option>
              <option value="marketing">Marketing</option>
              <option value="writing">Writing & Translation</option>
              <option value="video">Video & Animation</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Verification Quiz</h2>
          
          {quizQuestions.map((q) => (
            <div key={q.id} className="mb-4">
              <label className="block text-gray-700 mb-2">{q.question}</label>
              {q.type === 'text' && (
                <input
                  type="text"
                  onChange={(e) => handleQuizChange(q.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              )}
              {q.type === 'number' && (
                <input
                  type="number"
                  onChange={(e) => handleQuizChange(q.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              )}
              {q.type === 'textarea' && (
                <textarea
                  onChange={(e) => handleQuizChange(q.id, e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  rows="3"
                  required
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Document Upload</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Identification Document</label>
            <input
              type="file"
              name="identificationDoc"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Certification/License</label>
            <input
              type="file"
              name="certificationDoc"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Additional Supporting Document</label>
            <input
              type="file"
              name="additionalDoc"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default SellerApplicationForm;