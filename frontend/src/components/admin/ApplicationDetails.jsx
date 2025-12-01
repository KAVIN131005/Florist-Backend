import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import { ThemeContext } from "../../context/themeContextDefinition";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useContext(ThemeContext);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true);
      try {
        const all = await adminService.getFloristApplications();
        const found = (all || []).find(x => String(x.id) === String(id));
        if (!found) { 
          alert("Application not found"); 
          navigate("/admin/applications"); 
          return; 
        }
        setApplication(found);
      } catch (error) {
        console.error("Error fetching application:", error);
        alert("Failed to load application");
        navigate("/admin/applications");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchApplication();
    }
  }, [id, navigate]);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this application?")) return;
    try {
      await adminService.approveFlorist(id);
      alert("Application approved successfully!");
      navigate("/admin/applications");
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application. Please try again.");
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this application?")) return;
    try {
      await adminService.rejectFlorist(id);
      alert("Application rejected successfully!");
      navigate("/admin/applications");
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-60 ${dark ? 'text-white' : 'text-gray-500'}`}>
        <div className={`
          w-10 h-10 border-4 rounded-full animate-spin 
          ${dark ? 'border-pink-300 border-t-transparent' : 'border-pink-500 border-t-transparent'}
        `}></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={`p-8 text-center ${dark ? 'text-white' : 'text-gray-800'}`}>
        <h2 className="text-2xl font-bold mb-4">Application Not Found</h2>
        <p className="mb-6">The requested florist application could not be found.</p>
        <button
          onClick={() => navigate("/admin/applications")}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 md:p-8 max-w-4xl mx-auto ${dark ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate("/admin/applications")}
            className={`mb-4 px-4 py-2 rounded-lg transition-colors ${
              dark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            ← Back to Applications
          </button>
          <h1 className={`text-3xl font-bold ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
            Florist Application Details
          </h1>
        </div>
        
        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          application.status === 'PENDING' 
            ? dark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
            : application.status === 'APPROVED'
            ? dark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
            : dark ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          {application.status}
        </div>
      </div>

      {/* Application Details */}
      <div className={`rounded-xl shadow-lg p-6 mb-8 ${
        dark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applicant Information */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
              Applicant Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Full Name
                </label>
                <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {application.applicant?.name || application.floristName || 'N/A'}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email
                </label>
                <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {application.applicant?.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Phone Number
                </label>
                <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {application.applicant?.phone || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
              Business Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Shop Name
                </label>
                <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {application.shopName || application.floristName || 'N/A'}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Business Address
                </label>
                <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {application.applicant?.address || 'N/A'}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  GSTIN
                </label>
                <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {application.gstin || 'N/A'}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Application Date
                </label>
                <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                  {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Description */}
        <div className="mt-6">
          <h3 className={`text-xl font-semibold mb-4 ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
            Business Description
          </h3>
          <div className={`p-4 rounded-lg ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-lg leading-relaxed ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
              {application.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {/* Additional Details */}
        {(application.experience || application.specialties) && (
          <div className="mt-6">
            <h3 className={`text-xl font-semibold mb-4 ${dark ? 'text-pink-200' : 'text-pink-600'}`}>
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {application.experience && (
                <div>
                  <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Experience
                  </label>
                  <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                    {application.experience}
                  </p>
                </div>
              )}
              {application.specialties && (
                <div>
                  <label className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Specialties
                  </label>
                  <p className={`text-lg ${dark ? 'text-white' : 'text-gray-800'}`}>
                    {application.specialties}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {application.status === 'PENDING' && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleApprove}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Approve Application
          </button>
          <button
            onClick={handleReject}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Reject Application
          </button>
        </div>
      )}

      {/* Status Message for Non-Pending Applications */}
      {application.status !== 'PENDING' && (
        <div className={`text-center p-6 rounded-lg ${
          application.status === 'APPROVED'
            ? dark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
            : dark ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-lg font-medium ${
            application.status === 'APPROVED'
              ? dark ? 'text-green-300' : 'text-green-800'
              : dark ? 'text-red-300' : 'text-red-800'
          }`}>
            This application has been {application.status.toLowerCase()}.
          </p>
        </div>
      )}
    </div>
  );
}
