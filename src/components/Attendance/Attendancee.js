import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../common/layout";
import { TrendingUp, CircleCheckBig, CircleAlert, Clock4 } from "lucide-react";

// Simulated logged-in user (change role to 'admin', 'hr', or 'employee' to test)
// const currentUser = { id: 1, name: "John Doe", role: "hr" };

const MetricCard = ({ heading, value, description, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">{heading}</h3>
      {Icon && <Icon className="w-6 h-6 text-blue-600" />}
    </div>
    <p className="text-3xl font-bold text-gray-700 mb-2">{value}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

const AttendanceContent = ({ role }) => {
  const [state, setState] = useState({
    dailyRecords: [],
    allEmployees: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === "employee") {
          const response = await fetch("/employeeattendance.json");
          const data = await response.json();
          setState((prev) => ({
            ...prev,
            dailyRecords: data.dailyRecords || [],
            loading: false,
          }));
        } else if (role === "admin" || role === "hr") {
          const response = await fetch("/adminattendance.json");
          const data = await response.json();
          setState((prev) => ({
            ...prev,
            allEmployees: data.allEmployees || [],
            loading: false,
          }));
        }
      } catch (error) {
        console.error("Error loading attendance data:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, [role]);

  const { dailyRecords, allEmployees, loading } = state;

  const metrics =
    role === "employee"
      ? [
          {
            heading: "Attendance Rate",
            value: "98.5%",
            description: "Above dept. average",
            icon: TrendingUp,
          },
          {
            heading: "Days Present",
            value: "22",
            description: "This month",
            icon: CircleCheckBig,
          },
          {
            heading: "Late Arrivals",
            value: "2",
            description: "This month",
            icon: CircleAlert,
          },
          {
            heading: "Total Hours",
            value: "176",
            description: "This month",
            icon: Clock4,
          },
        ]
      : [
          {
            heading: "Today's Attendance",
            value: "92%",
            description: "225/245 present",
            icon: TrendingUp,
          },
          {
            heading: "On Time",
            value: "215",
            description: "95% of present",
            icon: CircleCheckBig,
          },
          {
            heading: "Late Arrivals",
            value: "10",
            description: "5% of present",
            icon: CircleAlert,
          },
          {
            heading: "Absent",
            value: "20",
            description: "8% of workforce",
            icon: Clock4,
          },
        ];

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        Loading attendance data...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {role === "employee" ? "My Attendance" : "Attendance Dashboard"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {(role === "admin" || role === "hr") && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            All Employee Attendance
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allEmployees.map((employee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.clockIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.clockOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : employee.status === "Late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {role === "employee" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Attendance Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clock Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.clockIn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.clockOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.hours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === "On Time"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const Attendance = ({ role }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      navigate("/login");
    }
  }, [role, navigate]);

  if (!role) return null;

  return (
    <Layout>
      <AttendanceContent role={role} />
    </Layout>
  );
};

export default Attendance;
