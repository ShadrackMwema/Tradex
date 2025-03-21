import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { server } from '../../server';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SellerApplicationForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const userId = user?._id;

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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Sample quiz questions
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

  const nextStep = () => {
    setCurrentStep(Math.min(currentStep + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!userId) {
        throw new Error('User ID is missing. Please log in again.');
      }

      // Create FormData for file uploads
      const formDataForUpload = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === 'quizAnswers') {
          formDataForUpload.append(key, JSON.stringify(formData[key]));
        } else {
          formDataForUpload.append(key, formData[key]);
        }
      });

      // Add files
      Object.keys(documents).forEach((key) => {
        if (documents[key]) {
          formDataForUpload.append(key, documents[key]);
        }
      });

      // Add the user ID to the FormData
      formDataForUpload.append('userId', userId);

      // Submit to backend
      const response = await axios.post(`${server}/application/application`, formDataForUpload);
      toast.success(response.data.message);

      // Redirect to profile page
      navigate('/profile', { state: { applicationId: response.data.applicationId } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[...Array(totalSteps)].map((_, index) => (
            <div key={index} className="text-sm font-medium">
              Step {index + 1}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Become a Verified Seller</h1>
      {renderProgressBar()}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700 pb-2 border-b border-gray-200">Business Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Service Category</label>
                <select
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
          </div>
        )}

        {/* Step 2: Verification Quiz */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700 pb-2 border-b border-gray-200">Professional Verification</h2>
            <p className="text-gray-600 mb-4">Please answer the following questions to help us understand your expertise.</p>

            {quizQuestions.map((q) => (
              <div key={q.id} className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">{q.question}</label>
                {q.type === 'text' && (
                  <input
                    type="text"
                    onChange={(e) => handleQuizChange(q.id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                )}
                {q.type === 'number' && (
                  <input
                    type="number"
                    onChange={(e) => handleQuizChange(q.id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                )}
                {q.type === 'textarea' && (
                  <textarea
                    onChange={(e) => handleQuizChange(q.id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows="4"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-700 pb-2 border-b border-gray-200">Document Verification</h2>
            <p className="text-gray-600 mb-4">Please upload the required documents to complete your verification.</p>

            <div className="space-y-6">
              <div className="p-5 border-2 border-dashed border-gray-300 rounded-lg">
                <label className="block text-gray-700 font-medium mb-2">Identification Document</label>
                <p className="text-sm text-gray-500 mb-3">Upload a government-issued ID (passport, driver's license, etc.)</p>
                <input
                  type="file"
                  name="identificationDoc"
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>

              <div className="p-5 border-2 border-dashed border-gray-300 rounded-lg">
                <label className="block text-gray-700 font-medium mb-2">Certification/License</label>
                <p className="text-sm text-gray-500 mb-3">Upload relevant professional certifications or licenses</p>
                <input
                  type="file"
                  name="certificationDoc"
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>

              <div className="p-5 border-2 border-dashed border-gray-300 rounded-lg">
                <label className="block text-gray-700 font-medium mb-2">Additional Supporting Document</label>
                <p className="text-sm text-gray-500 mb-3">Portfolio, reference letters, or other relevant documents (optional)</p>
                <input
                  type="file"
                  name="additionalDoc"
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back
            </button>
          )}
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SellerApplicationForm;