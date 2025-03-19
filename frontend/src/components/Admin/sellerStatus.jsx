import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../../server';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const AdminSellerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const navigate = useNavigate();

  // Fetch all applications based on status filter
  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${server}/application/seller-applications`, {
        params: { status: statusFilter },
        withCredentials: true,
      });
      setApplications(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications.');
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific application details
  const fetchApplicationDetails = async (id) => {
    setIsDetailsLoading(true);
    try {
      const response = await axios.get(`${server}/application/seller-applications/${id}`, {
        withCredentials: true,
      });
      setSelectedApplication(response.data);
      setReviewNotes(response.data.reviewNotes || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch application details.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // Fetch AI analysis
  const fetchAiAnalysis = async (id) => {
    try {
      const response = await axios.get(`${server}/application/seller-applications/${id}/ai-analysis`, {
        withCredentials: true,
      });
      setAiAnalysis(response.data);
    } catch (err) {
      console.error('AI analysis not available:', err);
      setAiAnalysis(null);
    }
  };

  // Handle application approval
  const handleApprove = async () => {
    const isConfirmed = window.confirm('Are you sure you want to approve this application?');
    if (!isConfirmed) return;

    setIsProcessing(true);
    try {
      await axios.put(
        `${server}/application/seller-applications/${selectedApplication._id}/approve`,
        { reviewNotes },
        { withCredentials: true }
      );
      setSelectedApplication(prev => ({ ...prev, status: 'approved', reviewNotes }));
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve application.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle application rejection
  const handleReject = async () => {
    const isConfirmed = window.confirm('Are you sure you want to reject this application?');
    if (!isConfirmed) return;

    setIsProcessing(true);
    try {
      await axios.put(
        `${server}/application/seller-applications/${selectedApplication._id}/reject`,
        { reviewNotes },
        { withCredentials: true }
      );
      setSelectedApplication(prev => ({ ...prev, status: 'rejected', reviewNotes }));
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject application.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle request for more information
  const handleRequestInfo = async () => {
    const isConfirmed = window.confirm('Are you sure you want to request more information?');
    if (!isConfirmed) return;

    setIsProcessing(true);
    try {
      await axios.put(
        `${server}/application/seller-applications/${selectedApplication._id}/request-info`,
        { reviewNotes },
        { withCredentials: true }
      );
      setSelectedApplication(prev => ({ ...prev, status: 'more-info', reviewNotes }));
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request more information.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  // Get color class based on risk score
  const getRiskScoreColor = (score) => {
    if (!score && score !== 0) return 'text-gray-500';
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'more-info': return 'bg-yellow-100 text-yellow-800';
      case 'pending': default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Application Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Applications List */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Applications</h2>
              <div className="flex gap-2">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="more-info">More Info Needed</option>
                </select>
                <button 
                  onClick={fetchApplications}
                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                >
                  Refresh
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : applications.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No {statusFilter} applications found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr 
                        key={app._id} 
                        className={`hover:bg-gray-50 ${selectedApplication?._id === app._id ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-4 py-3 text-sm">{app.businessName}</td>
                        <td className="px-4 py-3 text-sm">{app.serviceCategory}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(app.createdAt)}</td>
                        <td className={`px-4 py-3 text-sm font-medium ${getRiskScoreColor(app.aiAnalysis?.riskScore)}`}>
                          {app.aiAnalysis?.riskScore !== undefined ? app.aiAnalysis.riskScore : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => fetchApplicationDetails(app._id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Application Details */}  
        <div className="lg:w-1/2">
          {selectedApplication ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Application Details</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedApplication.status)}`}>
                  {selectedApplication.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium">{selectedApplication.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Email</p>
                    <p className="font-medium">{selectedApplication.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{selectedApplication.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service Category</p>
                    <p className="font-medium">{selectedApplication.serviceCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Years of Experience</p>
                    <p className="font-medium">{selectedApplication.experienceYears}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Date</p>
                    <p className="font-medium">{formatDate(selectedApplication.createdAt)}</p>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
                  {aiAnalysis ? (
                    <div className="bg-gray-50 p-4 rounded">
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500 mr-2">Risk Score:</span>
                        <span className={`font-medium ${getRiskScoreColor(aiAnalysis.riskScore)}`}>
                          {aiAnalysis.riskScore}
                        </span>
                      </div>
                      {aiAnalysis.analysisResult && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Analysis:</p>
                          <p className="text-sm">{aiAnalysis.analysisResult}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No AI analysis available for this application.</p>
                  )}
                </div>

                {/* Documents Section */}
                {selectedApplication.documents && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Uploaded Documents</h3>
                    <div className="space-y-2">
                      {selectedApplication.documents.identificationDoc && (
                        <div>
                          <a
                            href={selectedApplication.documents.identificationDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Identification Document
                          </a>
                        </div>
                      )}
                      {selectedApplication.documents.certificationDoc && (
                        <div>
                          <a
                            href={selectedApplication.documents.certificationDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Certification Document
                          </a>
                        </div>
                      )}
                      {selectedApplication.documents.additionalDoc && (
                        <div>
                          <a
                            href={selectedApplication.documents.additionalDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Additional Document
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                <div className="mt-6">
                  <label htmlFor="reviewNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Review Notes
                  </label>
                  <textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add notes about this application..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing || selectedApplication.status === 'approved'}
                    className={`px-4 py-2 rounded font-medium ${
                      isProcessing || selectedApplication.status === 'approved'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isProcessing || selectedApplication.status === 'rejected'}
                    className={`px-4 py-2 rounded font-medium ${
                      isProcessing || selectedApplication.status === 'rejected'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleRequestInfo}
                    disabled={isProcessing || selectedApplication.status === 'more-info'}
                    className={`px-4 py-2 rounded font-medium ${
                      isProcessing || selectedApplication.status === 'more-info'
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    Request Info
                  </button>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Select an application from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>  
  );
};

export default AdminSellerApplications;