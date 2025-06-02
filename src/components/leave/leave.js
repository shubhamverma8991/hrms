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
import Layout from "../common/layout";
import CommonCard from "../common/commoncard";
import CommonTable from "../common/commontable";

const iconMap = {
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
};

const formatDynamicDesc = (template, data) => {
  if (!data) return "";
  if (typeof data === "object") {
    return template.replace(/{(\w+)}/g, (_, key) => data[key] || "0");
  }
  return template.replace(/{value}/g, data || "0");
};

const LeaveContent = ({ role }) => {
  const [state, setState] = useState({
    leaveData: {},
    loading: true,
    icons: {},
    leaveHistory: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [iconsData, leaveData] = await Promise.all([
          fetch("/icons.json").then((r) => r.json()),
          fetch("/leavedata.json").then((r) => r.json()),
        ]);

        // Fetch leave history from API if user is an employee
        let leaveHistory = [];
        if (role === "employee") {
          const historyResponse = await fetch(
            "https://683d766f199a0039e9e590c5.mockapi.io/hrms/api/leavehistory"
          );
          leaveHistory = await historyResponse.json();
        }

        setState({
          icons: iconsData,
          leaveData,
          leaveHistory,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [role]);

  const { leaveData, loading, icons, leaveHistory } = state;
  const isAdminOrHr = role === "admin" || role === "hr";
  const cardType = isAdminOrHr ? "admin" : "employee";
  const tableData = isAdminOrHr
    ? leaveData[role]?.leaveRequests || []
    : leaveHistory;

  const columns = isAdminOrHr
    ? [
        { label: "ID", key: "id", icon: iconMap[icons.Hash] },
        { label: "Employee", key: "employeeName", icon: iconMap[icons.User] },
        { label: "Leave Type", key: "leaveType", icon: iconMap[icons.Tag] },
        {
          label: "Start Date",
          key: "startDate",
          icon: iconMap[icons.Calendar],
        },
        { label: "End Date", key: "endDate", icon: iconMap[icons.Calendar] },
        {
          label: "Status",
          key: "status",
          icon: iconMap[icons.CircleDot],
          render: (status) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
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
        { label: "Reason", key: "reason", icon: iconMap[icons.MessageSquare] },
      ]
    : [
        { label: "ID", key: "id", icon: iconMap[icons.Hash] },
        { label: "Leave Type", key: "leaveType", icon: iconMap[icons.Tag] },
        {
          label: "Start Date",
          key: "startDate",
          icon: iconMap[icons.Calendar],
        },
        { label: "End Date", key: "endDate", icon: iconMap[icons.Calendar] },
        {
          label: "Status",
          key: "status",
          icon: iconMap[icons.CircleDot],
          render: (status) => (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
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
        { label: "Reason", key: "reason", icon: iconMap[icons.MessageSquare] },
      ];

  if (loading || !icons.cardData) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const cardData = icons.cardData.leave[cardType];

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold mb-6">
        {isAdminOrHr
          ? `${role === "admin" ? "Admin" : "HR"} Leave Management`
          : "My Leave"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {cardData.map(({ title, desc, icon, key, dynamicDesc }) => (
          <CommonCard
            key={title}
            title={title}
            desc={
              dynamicDesc
                ? formatDynamicDesc(dynamicDesc, leaveData[role]?.[key])
                : desc
            }
            icon={iconMap[icon]}
          />
        ))}
      </div>
      <CommonTable
        title={isAdminOrHr ? "Leave Requests" : "My Leave History"}
        desc={
          isAdminOrHr
            ? "Detailed view and management of leave requests."
            : "See your leave application history and status."
        }
        columns={columns}
        data={tableData}
      />
    </div>
  );
};

const Leave = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (!role) navigate("/login");
  }, [role, navigate]);

  if (!role) return null;

  return (
    <Layout>
      <LeaveContent role={role} />
    </Layout>
  );
};

export default Leave;
