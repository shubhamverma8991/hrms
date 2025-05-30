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
  hr: [], // same as admin, will fallback in component
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

const LeaveContent = ({ role }) => {
  const [leaveData, setLeaveData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/leavedata.json")
      .then((r) => r.json())
      .then((data) => {
        setLeaveData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const titles = role === "hr" ? cardTitles.admin : cardTitles[role];

  const getDynamicDesc = (title) => {
    if (!leaveData[role]) return "";
    const data = leaveData[role];
    switch (title) {
      case "Pending Requests":
        return `${data.pendingRequests || 0} requests awaiting approval.`;
      case "Approved This Month":
        return `${data.approvedThisMonth || 0} leaves approved this month.`;
      case "Rejected This Month":
        return `${data.rejectedThisMonth || 0} leaves rejected this month.`;
      case "On Leave Today":
        return `${data.onLeaveToday || 0} employees on leave today.`;
      case "Available Leave":
        const { annual = 0, sick = 0, casual = 0 } = data.availableLeave || {};
        return `Annual: ${annual}, Sick: ${sick}, Casual: ${casual}`;
      case "Approved This Year":
        return `${data.approvedThisYear || 0} leaves approved this year.`;
      case "Sick Leave":
        return `${data.sickLeaveUsed || 0} sick leaves used this year.`;
      default:
        return "";
    }
  };

  const renderFlexCards = () =>
    titles.map(({ title, baseDesc, icon: Icon }, i) => (
      <Card
        key={i}
        title={title}
        desc={getDynamicDesc(title) || baseDesc}
        icon={<Icon className="inline mr-2 w-5 h-5 text-gray-700" />}
      />
    ));

  // Generic table component to reduce duplication
  const LeaveTable = ({ columns, data, title, description }) => (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {columns.map(({ label, icon: Icon }, i) => (
                  <th
                    key={i}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                  >
                    {Icon && <Icon className="inline mr-2 w-4 h-4" />}
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {columns.map(({ key, render }, i) => (
                    <td
                      key={i}
                      className={`px-4 py-2 text-sm ${
                        key === "status" ? "" : "text-gray-600"
                      }`}
                    >
                      {render ? render(item[key], item) : item[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">{`No ${title.toLowerCase()} available.`}</p>
      )}
    </div>
  );

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;

  // Prepare data for tables
  const isAdminOrHr = role === "admin" || role === "hr";
  const tableData = isAdminOrHr
    ? leaveData[role]?.leaveRequests || []
    : leaveData[role]?.leaveHistory || [];

  // Columns for admin/hr
  const adminHrColumns = [
    { label: "ID", key: "id", icon: Hash },
    { label: "Employee", key: "employeeName", icon: User },
    { label: "Leave Type", key: "leaveType", icon: Tag },
    { label: "Start Date", key: "startDate", icon: Calendar },
    { label: "End Date", key: "endDate", icon: Calendar },
    {
      label: "Status",
      key: "status",
      icon: CircleDot,
      render: (status) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            status === "Approved"
              ? "bg-green-100 text-green-800"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    { label: "Reason", key: "reason", icon: MessageSquare },
  ];

  // Columns for employee
  const employeeColumns = [
    { label: "ID", key: "id", icon: Hash },
    { label: "Leave Type", key: "leaveType", icon: Tag },
    { label: "Start Date", key: "startDate", icon: Calendar },
    { label: "End Date", key: "endDate", icon: Calendar },
    {
      label: "Status",
      key: "status",
      icon: CircleDot,
      render: (status) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            status === "Approved"
              ? "bg-green-100 text-green-800"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    { label: "Reason", key: "reason", icon: MessageSquare },
  ];

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
      <LeaveTable
        title={isAdminOrHr ? "Leave Requests" : "My Leave History"}
        description={
          isAdminOrHr
            ? "Detailed view and management of leave requests."
            : "See your leave application history and status."
        }
        columns={isAdminOrHr ? adminHrColumns : employeeColumns}
        data={tableData}
      />
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
