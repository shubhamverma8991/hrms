// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../common/layout";
import InfoCard from "../common/InfoCard";
import LeaveRequest from "../common/LeaveRequest";
import OnboardItem from "../common/OnboardItem";
import LeaveItem from "../common/LeaveItem";
import ProfileSection from "../common/ProfileSection";
import RecentActivity from "../common/RecentActivity";
import { BarChart3, Users, FileText, ClipboardList } from "lucide-react";

const DashboardContent = ({ role }) => {
  const [data, setData] = useState({
    metrics: {},
    leaveRequests: [],
    onboardItems: [],
    recentActivities: [],
    leaveItems: [],
    profileData: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/data.json"), fetch("/profiledata.json")])
      .then(([dataRes, profileRes]) =>
        Promise.all([dataRes.json(), profileRes.json()])
      )
      .then(([jsonData, profileData]) => {
        setData({
          ...jsonData,
          profileData: profileData[role],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      });
  }, [role]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {role === "admin"
            ? "Welcome, Admin!"
            : role === "hr"
            ? "Welcome, HR!"
            : "Welcome, Employee!"}
        </h1>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.metrics?.[role]?.map((metric, index) => (
            <InfoCard
              key={index}
              title={metric.title}
              value={metric.value}
              note={metric.note}
            />
          ))}
        </div>

        {/* Role-specific Sections */}
        {role === "admin" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {/* Department Distribution */}
            <div className="bg-gray-50 p-6 rounded-xl shadow flex flex-col items-center justify-center h-64">
              <span className="text-gray-400 mb-2">
                <BarChart3 className="h-8 w-8" />
              </span>
              <p className="text-gray-500">Department Distribution Chart</p>
            </div>

            {/* Recent Activities */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              {data.recentActivities?.map((activity, index) => (
                <RecentActivity key={index} {...activity} />
              ))}
            </div>
          </div>
        )}

        {role === "hr" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {/* Leave Requests */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Pending Leave Requests
              </h2>
              {data.leaveRequests?.map((request, index) => (
                <LeaveRequest key={index} {...request} />
              ))}
            </div>

            {/* Onboarding */}
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Onboarding</h2>
              {data.onboardItems?.map((item, index) => (
                <OnboardItem key={index} {...item} />
              ))}
            </div>
          </div>
        )}

        {role === "employee" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {/* Leave History */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>
              {data.leaveItems?.map((item, index) => (
                <LeaveItem key={index} {...item} />
              ))}
            </div>
          </div>
        )}

        {/* Profile Section for all roles */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>
          <ProfileSection profileData={data.profileData} />
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {role === "admin" && (
              <>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Manage Employees</h3>
                  <p className="text-sm text-gray-600">
                    Add, update, or remove employee records
                  </p>
                </button>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <FileText className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Leave Management</h3>
                  <p className="text-sm text-gray-600">
                    Review and manage leave requests
                  </p>
                </button>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">View Reports</h3>
                  <p className="text-sm text-gray-600">
                    Access and analyze company data
                  </p>
                </button>
              </>
            )}
            {role === "hr" && (
              <>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Employee Directory</h3>
                  <p className="text-sm text-gray-600">
                    View and manage employee information
                  </p>
                </button>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <ClipboardList className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Onboarding</h3>
                  <p className="text-sm text-gray-600">
                    Manage new employee onboarding
                  </p>
                </button>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <FileText className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Leave Requests</h3>
                  <p className="text-sm text-gray-600">
                    Process employee leave requests
                  </p>
                </button>
              </>
            )}
            {role === "employee" && (
              <>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <FileText className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">Request Leave</h3>
                  <p className="text-sm text-gray-600">
                    Submit a new leave request
                  </p>
                </button>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <ClipboardList className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">My Projects</h3>
                  <p className="text-sm text-gray-600">
                    View your assigned projects
                  </p>
                </button>
                <button className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium">My Profile</h3>
                  <p className="text-sm text-gray-600">
                    View and update your information
                  </p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  if (!role) return null;

  return (
    <Layout>
      <DashboardContent role={role} />
    </Layout>
  );
};

export default Dashboard;
