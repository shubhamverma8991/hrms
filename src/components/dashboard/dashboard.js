// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../common/layout";
import InfoCard from "../common/InfoCard";
import LeaveRequest from "../common/LeaveRequest";
import LeaveItem from "../common/LeaveItem";
import ProfileSection from "../common/ProfileSection";
import RecentActivity from "../common/RecentActivity";
import { BarChart3, Users, FileText, ClipboardList } from "lucide-react";

const DashboardContent = ({ role }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    metrics: {},
    leaveRequests: [],
    onboardItems: [],
    recentActivities: [],
    leaveItems: [],
    profileData: null,
    departmentStats: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/data.json"), fetch("/profiledata.json")])
      .then(([dataRes, profileRes]) =>
        Promise.all([dataRes.json(), profileRes.json()])
      )
      .then(([jsonData, profileData]) => {
        // Calculate department distribution
        const deptCount = {};
        jsonData.users.forEach((user) => {
          deptCount[user.department] = (deptCount[user.department] || 0) + 1;
        });

        const departmentStats = Object.entries(deptCount).map(
          ([dept, count]) => ({
            department: dept,
            count: count,
          })
        );

        setData({
          ...jsonData,
          profileData: profileData[role],
          departmentStats,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      });
  }, [role]);

  const handleCardClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const renderDepartmentChart = () => (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
      <div className="space-y-4">
        {data.departmentStats.map((dept) => (
          <div key={dept.department} className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {dept.department}
              </span>
              <span className="text-sm text-gray-600">{dept.count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(dept.count / data.summary.totalEmployees) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuickActions = () => {
    const actions = {
      admin: [
        {
          path: "/employee",
          icon: Users,
          title: "Manage Employees",
          desc: "Add, update, or remove employee records",
        },
        {
          path: "/leave",
          icon: FileText,
          title: "Leave Management",
          desc: "Review and manage leave requests",
        },
        {
          path: "/reports",
          icon: BarChart3,
          title: "View Reports",
          desc: "Access and analyze company data",
        },
      ],
      hr: [
        {
          path: "/employee",
          icon: Users,
          title: "Employee Directory",
          desc: "View and manage employee information",
        },
        {
          path: "/onboarding",
          icon: ClipboardList,
          title: "Onboarding",
          desc: "Manage new employee onboarding",
        },
        {
          path: "/leave",
          icon: FileText,
          title: "Leave Requests",
          desc: "Process employee leave requests",
        },
      ],
      employee: [
        {
          path: "/leave",
          icon: FileText,
          title: "Request Leave",
          desc: "Submit a new leave request",
        },
        {
          path: "/task",
          icon: ClipboardList,
          title: "My Projects",
          desc: "View your assigned projects",
        },
      ],
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions[role].map((action, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(action.path)}
            className="p-4 text-left hover:bg-gray-50 rounded-lg transition border border-gray-200 cursor-pointer"
          >
            <action.icon className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-medium">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.desc}</p>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {role === "admin"
              ? "Welcome, Admin!"
              : role === "hr"
              ? "Welcome, HR!"
              : `Welcome, ${
                  data.profileData?.personalInfo?.Name?.split(" ")[0]
                }!`}
          </h1>
        </div>

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
            <div className="bg-white p-6 rounded-xl shadow">
              {renderDepartmentChart()}
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {data.recentActivities?.[0] && (
                <RecentActivity {...data.recentActivities[0]} />
              )}
            </div>
          </div>
        )}

        {role === "hr" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {/* Leave Requests */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Pending Leave Requests
              </h2>
              {data.leaveRequests?.map((request, index) => (
                <LeaveRequest key={index} {...request} />
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {data.recentActivities?.[0] && (
                <RecentActivity {...data.recentActivities[0]} />
              )}
            </div>
          </div>
        )}

        {role === "employee" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {/* Leave History */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>
              {data.leaveItems?.map((item, index) => (
                <LeaveItem key={index} {...item} />
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {data.recentActivities?.[0] && (
                <RecentActivity {...data.recentActivities[0]} />
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          {renderQuickActions()}
        </div>

        {/* Profile Section */}
        <div id="profile-section" className="mt-10">
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>
          <ProfileSection profileData={data.profileData} />
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
