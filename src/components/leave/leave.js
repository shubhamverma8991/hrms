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
  AlertCircle,
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
  AlertCircle,
};

const formatDynamicDesc = (template, data) => {
  if (!template) return "";
  if (!data) return template.replace(/{(\w+)}/g, "0");

  if (typeof data === "object") {
    return template.replace(/{(\w+)}/g, (_, key) => data[key]?.toString() || "0");
  }
  return template.replace(/{value}/g, data.toString() || "0");
};

const ErrorMessage = ({ message }) => (
  <div className="flex items-center justify-center p-4 bg-red-50 text-red-700 rounded-lg">
    <AlertCircle className="w-5 h-5 mr-2" />
    <span>{message}</span>
  </div>
);

const LeaveContent = ({ role }) => {
  const [state, setState] = useState({
    leaveData: {},
    loading: true,
    icons: {},
    leaveHistory: [],
    error: null,
  });

  // Date filter state with string yyyy-mm-dd format
  const [filterDates, setFilterDates] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [iconsResponse, leaveDataResponse] = await Promise.all([
          fetch("/icons.json"),
          fetch("/leavedata.json"),
        ]);

        if (!iconsResponse.ok || !leaveDataResponse.ok) {
          throw new Error("Failed to fetch required data");
        }

        const [iconsData, leaveData] = await Promise.all([
          iconsResponse.json(),
          leaveDataResponse.json(),
        ]);

        let leaveHistory = [];
        if (role === "employee") {
          const historyResponse = await fetch(
            "https://683d766f199a0039e9e590c5.mockapi.io/hrms/api/leavehistory"
          );

          if (!historyResponse.ok) {
            throw new Error("Failed to fetch leave history");
          }

          leaveHistory = await historyResponse.json();
        }

        setState({
          icons: iconsData,
          leaveData,
          leaveHistory,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to load data",
        }));
      }
    };

    fetchData();
  }, [role]);

  const { leaveData, loading, icons, leaveHistory, error } = state;
  const isAdminOrHr = role === "admin" || role === "hr";
  const cardType = isAdminOrHr ? "admin" : "employee";

  const handleStatusChange = (id, newStatus) => {
    setState((prevState) => {
      const updatedRequests = prevState.leaveData[role].leaveRequests.map((leave) =>
        leave.id === id ? { ...leave, status: newStatus } : leave
      );

      return {
        ...prevState,
        leaveData: {
          ...prevState.leaveData,
          [role]: {
            ...prevState.leaveData[role],
            leaveRequests: updatedRequests,
          },
        },
      };
    });
  };

  // Filter leave requests by date range
  const filterByDate = (leaves) => {
    if (!filterDates.startDate && !filterDates.endDate) return leaves;

    return leaves.filter((leave) => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      const filterStart = filterDates.startDate ? new Date(filterDates.startDate) : null;
      const filterEnd = filterDates.endDate ? new Date(filterDates.endDate) : null;

      if (filterStart && leaveEnd < filterStart) return false;
      if (filterEnd && leaveStart > filterEnd) return false;
      return true;
    });
  };

  const rawTableData = isAdminOrHr
    ? (leaveData[role]?.leaveRequests || []).map((leave) => ({
        ...leave,
        status: leave.status || "Pending",
      }))
    : leaveHistory || [];

  const tableData = isAdminOrHr ? filterByDate(rawTableData) : rawTableData;

  const columns = isAdminOrHr
    ? [
        { label: "ID", key: "id", icon: iconMap.Hash },
        { label: "Employee", key: "employeeName", icon: iconMap.User },
        { label: "Leave Type", key: "leaveType", icon: iconMap.Tag },
        { label: "Start Date", key: "startDate", icon: iconMap.Calendar },
        { label: "End Date", key: "endDate", icon: iconMap.Calendar },
        {
          label: "Status",
          key: "status",
          icon: iconMap.CircleDot,
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
        {
          label: "Reason",
          key: "reason",
          icon: iconMap.MessageSquare,
        },
        {
          label: "Action",
          key: "action",
          render: (_, row) => {
            if (row.status === "Pending") {
              return (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(row.id, "Approved")}
                    className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Grant
                  </button>
                  <button
                    onClick={() => handleStatusChange(row.id, "Rejected")}
                    className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Reject
                  </button>
                </div>
              );
            } else if (row.status === "Approved") {
              return (
                <button
                  disabled
                  className="bg-gray-400 text-white px-2 py-1 text-xs rounded cursor-not-allowed"
                >
                  Granted
                </button>
              );
            } else if (row.status === "Rejected") {
              return (
                <button
                  disabled
                  className="bg-gray-400 text-white px-2 py-1 text-xs rounded cursor-not-allowed"
                >
                  Rejected
                </button>
              );
            }
            return null; // No action button for other cases
          },
        },
      ]
    : [
        { label: "ID", key: "id", icon: iconMap.Hash },
        { label: "Leave Type", key: "leaveType", icon: iconMap.Tag },
        { label: "Start Date", key: "startDate", icon: iconMap.Calendar },
        { label: "End Date", key: "endDate", icon: iconMap.Calendar },
        {
          label: "Status",
          key: "status",
          icon: iconMap.CircleDot,
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
        { label: "Reason", key: "reason", icon: iconMap.MessageSquare },
      ];

  const cardData = icons?.cardData?.leave?.[cardType] || [];

  if (!cardData.length && !loading) {
    return <ErrorMessage message="Invalid configuration: Card data not found" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">
          {isAdminOrHr
            ? `${role === "admin" ? "Admin" : "HR"} Leave Management`
            : "My Leave"}
        </h1>
      </div>

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

      {/* Date filter inputs on right */}
      {isAdminOrHr && (
        <div className="flex justify-end mb-4 gap-4 items-center">
          <label className="text-sm font-semibold" htmlFor="startDate">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={filterDates.startDate}
            onChange={(e) =>
              setFilterDates((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="border border-gray-300 rounded px-2 py-1"
          />

          <label className="text-sm font-semibold" htmlFor="endDate">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={filterDates.endDate}
            onChange={(e) =>
              setFilterDates((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="border border-gray-300 rounded px-2 py-1"
          />

          <button
            onClick={() => setFilterDates({ startDate: "", endDate: "" })}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>
      )}

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
