import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { server } from '../../server';

const SellerApplicationStatus = () => {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the applicationId from the URL state
  const location = useLocation();
  const applicationId = location.state?.applicationId;

  // Fetch application details
  useEffect(() => {
    if (!applicationId) {
      setError('Application ID is missing.');
      setIsLoading(false);
      return;
    }

    const fetchApplicationStatus = async () => {
      try {
        const response = await axios.get(`${server}/application/application/${applicationId}`);
        setApplication(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch application status.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [applicationId]);

  if (isLoading) {
    return <div className="text-center py-4">Loading application status...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (!application) {
    return <div className="text-center py-4">No application found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Application Status</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Business Name:</label>
          <p className="text-gray-900">{application.businessName}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Contact Email:</label>
          <p className="text-gray-900">{application.contactEmail}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Service Category:</label>
          <p className="text-gray-900">{application.serviceCategory}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Years of Experience:</label>
          <p className="text-gray-900">{application.experienceYears}</p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Status:</label>
          <p
            className={`font-semibold ${
              application.status === 'approved'
                ? 'text-green-600'
                : application.status === 'rejected'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {application.status.toUpperCase()}
          </p>
        </div>

        {application.reviewNotes && (
          <div>
            <label className="block text-gray-700 font-semibold">Review Notes:</label>
            <p className="text-gray-900">{application.reviewNotes}</p>
          </div>
        )}

        {application.aiAnalysis && (
          <div>
            <label className="block text-gray-700 font-semibold">AI Analysis:</label>
            <p className="text-gray-900">
              Risk Score: {application.aiAnalysis.riskScore || 'N/A'}
            </p>
            <p className="text-gray-900">
              Analysis Result: {application.aiAnalysis.analysisResult || 'N/A'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerApplicationStatus;