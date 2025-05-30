import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  UserMinus,
  CalendarCheck,
  Thermometer,
  Hash,
  User,
  Tag,
  Calendar,
  CircleDot,
  MessageSquare,
} from "lucide-react";

const LeaveContent = ({ role }) => {
  const [leaveData, setLeaveData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/leavedata.json")
      .then((response) => response.json())
      .then((data) => {
        setLeaveData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leave data:", error);
        setLoading(false);
      });
  }, []);

  const cardTitles = {
    admin: [
      {
        title: "Pending Requests",
        baseDesc: "View all pending leave requests.",
        icon: Clock,
      },
      {
        title: "Approved This Month",
        baseDesc: "Overview of approved leaves.",
        icon: CheckCircle,
      },
      {
        title: "Rejected This Month",
        baseDesc: "Details of rejected leave requests.",
        icon: XCircle,
      },
      {
        title: "On Leave Today",
        baseDesc: "Employees currently on leave.",
        icon: UserMinus,
      },
    ],
    hr: [
      {
        title: "Pending Requests",
        baseDesc: "View all pending leave requests.",
        icon: Clock,
      },
      {
        title: "Approved This Month",
        baseDesc: "Overview of approved leaves.",
        icon: CheckCircle,
      },
      {
        title: "Rejected This Month",
        baseDesc: "Details of rejected leave requests.",
        icon: XCircle,
      },
      {
        title: "On Leave Today",
        baseDesc: "Employees currently on leave.",
        icon: UserMinus,
      },
    ],
    employee: [
      {
        title: "Available Leave",
        baseDesc: "Check your current leave balance.",
        icon: CalendarCheck,
      },
      {
        title: "Pending Requests",
        baseDesc: "Your pending leave requests.",
        icon: Clock,
      },
      {
        title: "Approved This Year",
        baseDesc: "Leaves approved this year.",
        icon: CheckCircle,
      },
      {
        title: "Sick Leave",
        baseDesc: "Sick leave balance and usage.",
        icon: Thermometer,
      },
    ],
  };

  const getDynamicDesc = (title) => {
    if (!leaveData[role]) return "";
    switch (title) {
      case "Pending Requests":
        return `${
          leaveData[role].pendingRequests || 0
        } requests awaiting approval.`;
      case "Approved This Month":
        return `${
          leaveData[role].approvedThisMonth || 0
        } leaves approved this month.`;
      case "Rejected This Month":
        return `${
          leaveData[role].rejectedThisMonth || 0
        } leaves rejected this month.`;
      case "On Leave Today":
        return `${leaveData[role].onLeaveToday || 0} employees on leave today.`;
      case "Available Leave":
        const { annual, sick, casual } = leaveData[role].availableLeave || {};
        return `Annual: ${annual || 0}, Sick: ${sick || 0}, Casual: ${
          casual || 0
        }`;
      case "Approved This Year":
        return `${
          leaveData[role].approvedThisYear || 0
        } leaves approved this year.`;
      case "Sick Leave":
        return `${
          leaveData[role].sickLeaveUsed || 0
        } sick leaves used this year.`;
      default:
        return "";
    }
  };

  const renderFlexCards = () => {
    const cards = cardTitles[role] || [];
    return cards.map(({ title, baseDesc, icon: Icon }, i) => (
      <Card
        key={i}
        title={title}
        desc={getDynamicDesc(title) || baseDesc}
        icon={<Icon className="inline mr-2 w-5 h-5 text-gray-700" />}
      />
    ));
  };

  const renderStretchCard = () => {
    if (!leaveData[role]) return null;

    const tableData =
      role === "employee"
        ? leaveData[role].leaveHistory || []
        : leaveData[role].leaveRequests || [];

    if (role === "admin" || role === "hr") {
      return (
        <div className="bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold mb-2">Leave Requests</h2>
          <p className="text-gray-600 mb-4">
            Detailed view and management of leave requests.
          </p>
          {tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Hash className="inline mr-2 w-4 h-4" />
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <User className="inline mr-2 w-4 h-4" />
                      Employee
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Tag className="inline mr-2 w-4 h-4" />
                      Leave Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Calendar className="inline mr-2 w-4 h-4" />
                      Start Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Calendar className="inline mr-2 w-4 h-4" />
                      End Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <CircleDot className="inline mr-2 w-4 h-4" />
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <MessageSquare className="inline mr-2 w-4 h-4" />
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.employeeName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.leaveType}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.startDate}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.endDate}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No leave requests available.</p>
          )}
        </div>
      );
    }
    if (role === "employee") {
      return (
        <div className="bg-white p-4 rounded-lg shadow w-full">
          <h2 className="text-lg font-semibold mb-2">My Leave History</h2>
          <p className="text-gray-600 mb-4">
            See your leave application history and status.
          </p>
          {tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Hash className="inline mr-2 w-4 h-4" />
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Tag className="inline mr-2 w-4 h-4" />
                      Leave Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Calendar className="inline mr-2 w-4 h-4" />
                      Start Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <Calendar className="inline mr-2 w-4 h-4" />
                      End Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <CircleDot className="inline mr-2 w-4 h-4" />
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      <MessageSquare className="inline mr-2 w-4 h-4" />
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.leaveType}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.startDate}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.endDate}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No leave history available.</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6">
        {role === "employee"
          ? "My Leave"
          : `${role === "admin" ? "Admin" : "HR"} Leave Management`}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {renderFlexCards()}
      </div>
      <div>{renderStretchCard()}</div>
    </div>
  );
};

const Card = ({ title, desc, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-2 flex items-center">
      {icon}
      {title}
    </h2>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const Leave = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (!userRole) {
      navigate("/login");
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  if (!role) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* <NavBar role={role} /> */}
      <div className="py-10">
        <LeaveContent role={role} />
      </div>
    </div>
  );
};

export default Leave;
