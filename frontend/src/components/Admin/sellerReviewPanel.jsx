// src/components/Admin/SellerReviewPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SellerReviewPanel = () => {
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/seller-applications?status=${filterStatus}`);
      setApplications(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch applications');
      setLoading(false);
    }
  };

  const viewApplication = async (applicationId) => {
    try {
      const response = await axios.get(`/api/admin/seller-applications/${applicationId}`);
      setCurrentApplication(response.data);
      
      // Fetch AI analysis if available
      try {
        const aiResponse = await axios.get(`/api/admin/seller-applications/${applicationId}/ai-analysis`);
        setAiAnalysis(aiResponse.data);
      } catch (aiErr) {
        // AI analysis might not be available yet
        setAiAnalysis(null);
      }
      
      setReviewNotes('');
    } catch (err) {
      setError('Failed to load application details');
    }
  };

  const handleApprove = async () => {
    try {
      await axios.put(`/api/admin/seller-applications/${currentApplication._id}/approve`, {
        reviewNotes
      });
      
      // Update local state
      setApplications(applications.filter(app => app._id !== currentApplication._id));
      setCurrentApplication(null);
      
      // Show success message
      alert('Application approved successfully');
    } catch (err) {
      setError('Failed to approve application');
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`/api/admin/seller-applications/${currentApplication._id}/reject`, {
        reviewNotes
      });
      
      // Update local state
      setApplications(applications.filter(app => app._id !== currentApplication._id));
      setCurrentApplication(null);
      
      // Show success message
      alert('Application rejected');
    } catch (err) {
      setError('Failed to reject application');
    }
  };

  const handleRequestMoreInfo = async () => {
    try {
      await axios.put(`/api/admin/seller-applications/${currentApplication._id}/request-info`, {
        reviewNotes
      });
      
      // Update local state
      setApplications(applications.filter(app => app._id !== currentApplication._id));
      setCurrentApplication(null);
      
      // Show success message
      alert('Additional information requested');
    } catch (err) {
      setError('Failed to request additional information');
    }
  };

  if (loading && !currentApplication) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with applications list */}
      <div className="w-1/3 bg-white p-4 border-r overflow-y-auto">
        <h1 className="text-xl font-bold mb-4">Seller Applications</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        <div className="mb-4">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="more-info">Needs More Info</option>
          </select>
        </div>
        
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications found</p>
        ) : (
          <ul className="space-y-2">
            {applications.map((app) => (
              <li 
                key={app._id} 
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                  currentApplication && currentApplication._id === app._id ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => viewApplication(app._id)}
              >
                <div className="font-medium">{app.businessName}</div>
                <div className="text-sm text-gray-600">
                  {app.serviceCategory} • {new Date(app.createdAt).toLocaleDateString()}
                </div>
                {app.aiRiskScore && (
                  <div className={`mt-1 text-xs font-medium inline-block px-2 py-1 rounded ${
                    app.aiRiskScore < 30 ? 'bg-green-100 text-green-800' : 
                    app.aiRiskScore < 70 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    Risk Score: {app.aiRiskScore}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {currentApplication ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{currentApplication.businessName}</h1>
              <div className="flex space-x-2">
                <button 
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button 
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <button 
                  onClick={handleRequestMoreInfo}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Request More Info
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-3">Business Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Business Name</p>
                    <p className="font-medium">{currentApplication.businessName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Service Category</p>
                    <p className="font-medium">{currentApplication.serviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contact Email</p>
                    <p className="font-medium">{currentApplication.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone Number</p>
                    <p className="font-medium">{currentApplication.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Submission Date</p>
                    <p className="font-medium">{new Date(currentApplication.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {aiAnalysis && (
                <div className={`bg-white p-4 rounded shadow border-l-4 ${
                  aiAnalysis.riskScore < 30 ? 'border-green-500' : 
                  aiAnalysis.riskScore < 70 ? 'border-yellow-500' : 
                  'border-red-500'
                }`}>
                  <h2 className="text-lg font-semibold mb-3">AI Analysis</h2>
                  
                  <div className="mb-4">
                    <p className="text-gray-600">Risk Score</p>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            aiAnalysis.riskScore < 30 ? 'bg-green-500' : 
                            aiAnalysis.riskScore < 70 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${aiAnalysis.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{aiAnalysis.riskScore}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600">Document Authenticity</p>
                    <p className="font-medium">{aiAnalysis.documentAuthenticityScore}% confidence</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600">Key Findings</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {aiAnalysis.keyFindings.map((finding, index) => (
                        <li key={index} className={`${
                          finding.severity === 'high' ? 'text-red-600' : 
                          finding.severity === 'medium' ? 'text-yellow-600' : 
                          'text-gray-600'
                        }`}>
                          {finding.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-gray-600">Recommendation</p>
                    <p className="font-medium">{aiAnalysis.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-3">Quiz Responses</h2>
                {Object.entries(currentApplication.quizAnswers).map(([questionId, answer]) => (
                  <div key={questionId} className="mb-4">
                    <p className="text-gray-600">{getQuestionText(questionId)}</p>
                    <p className="font-medium">{answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-3">Uploaded Documents</h2>
                {Object.entries(currentApplication.documents).map(([docType, docUrl]) => (
                  <div key={docType} className="mb-4">
                    <p className="text-gray-600">{formatDocumentType(docType)}</p>
                    <div className="mt-2">
                      <a 
                        href={docUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow mb-6">
              <h2 className="text-lg font-semibold mb-3">Review Notes</h2>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                rows="4"
                placeholder="Add your review notes here..."
              ></textarea>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Select an application to review</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getQuestionText = (questionId) => {
  const questions = {
    q1: 'What is your primary area of expertise?',
    q2: 'How many years have you been providing this service?',
    q3: 'Describe your quality assurance process.',
    q4: 'What sets your service apart from competitors?',
  };
  return questions[questionId] || questionId;
};

const formatDocumentType = (docType) => {
  const types = {
    identificationDoc: 'Identification Document',
    certificationDoc: 'Certification/License',
    additionalDoc: 'Additional Supporting Document',
  };
  return types[docType] || docType;
};

export default SellerReviewPanel;