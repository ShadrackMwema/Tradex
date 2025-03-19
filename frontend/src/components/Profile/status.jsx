import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { server } from '../../server';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '../../redux/actions/user';
import { Loader, CheckCircle, XCircle, AlertCircle, FileText, ArrowLeft } from 'lucide-react';

const SellerApplicationStatus = () => {
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user from Redux state
  const { user, loading: userLoading } = useSelector((state) => state.user);

  // Load user data if not already loaded
  useEffect(() => {
    if (!user && !userLoading) {
      dispatch(loadUser());
    }
  }, [dispatch, user, userLoading]);

  // Fetch application details
  useEffect(() => {
    if (!user) return;

    const fetchApplicationStatus = async () => {
      try {
        const response = await axios.get(`${server}/application/user-applications`, {
          params: { userId: user._id },
          withCredentials: true,
        });

        if (response.data && response.data.length > 0) {
          const sortedApplications = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          const latestApplication = sortedApplications[0];

          const applicationDetails = await axios.get(
            `${server}/application/application/${latestApplication._id}`
          );
          setApplication(applicationDetails.data);
        } else {
          setError('No application found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch application status.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationStatus();
  }, [user]);

  if (userLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500 h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="text-red-500 mx-auto h-12 w-12" />
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={() => navigate('/seller/apply')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="text-yellow-500 mx-auto h-12 w-12" />
        <p className="text-gray-700">No application found. Please submit an application.</p>
        <button
          onClick={() => navigate('/seller/apply')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Application Status</h1>

      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded-lg">
          <label className="block text-gray-700 font-semibold">Business Name:</label>
          <p className="text-gray-900">{application.businessName}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <label className="block text-gray-700 font-semibold">Contact Email:</label>
          <p className="text-gray-900">{application.contactEmail}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <label className="block text-gray-700 font-semibold">Phone Number:</label>
          <p className="text-gray-900">{application.phoneNumber}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <label className="block text-gray-700 font-semibold">Service Category:</label>
          <p className="text-gray-900">{application.serviceCategory}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg flex items-center">
          <label className="block text-gray-700 font-semibold mr-2">Status:</label>
          {application.status === 'approved' ? (
            <CheckCircle className="text-green-600 h-6 w-6" />
          ) : application.status === 'rejected' ? (
            <XCircle className="text-red-600 h-6 w-6" />
          ) : (
            <AlertCircle className="text-yellow-600 h-6 w-6" />
          )}
          <p className="text-gray-900 ml-2 font-semibold">{application.status.toUpperCase()}</p>
        </div>

        {application.reviewNotes && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-gray-700 font-semibold">Review Notes:</label>
            <p className="text-gray-900">{application.reviewNotes}</p>
          </div>
        )}

        {application.documents && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-gray-700 font-semibold">Uploaded Documents:</label>
            <div className="space-y-2">
              {Object.entries(application.documents).map(([key, doc]) => (
                <div key={key} className="flex items-center space-x-2">
                  <FileText className="text-blue-600 h-5 w-5" />
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {key.replace(/([A-Z])/g, ' $1')}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            <ArrowLeft className="mr-2" /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerApplicationStatus;
