import React, { useEffect, useState } from "react";
import { TrendingUp, CircleCheckBig, CircleAlert, Clock4 } from "lucide-react";

// Simulated logged-in user (change role to 'admin', 'hr', or 'employee' to test)
// const currentUser = { id: 1, name: "John Doe", role: "hr" };

export default function Attendance({role}) {
//   const { role } = currentUser;
//   console.log("role ", role);

  const [dailyRecords, setDailyRecords] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  useEffect(() => {
    if (role === "employee") {
      fetch("/employee-attendance.json")
        .then((res) => res.json())
        .then((data) => setDailyRecords(data.dailyRecords))
        .catch((err) => console.error("Error loading employee data:", err));
    } else if (role === "admin" || role === "hr") {
      fetch("/adminattendance.json")
        .then((res) => res.json())
        .then((data) => {
          setAllEmployees(data.allEmployees);

          console.log(data.allEmployees);
        })
        .catch((err) => console.error("Error loading admin/hr data:", err));
    }
  }, [role]);

  useEffect(() => {
    console.log(allEmployees);
  });

  const metrics =
    role === "employee"
      ? [
          {
            heading: "Attendance Rate",
            value: "98.5%",
            description: "Above dept. average",
            icon: <TrendingUp size={24} />,
          },
          {
            heading: "Days Present",
            value: "22",
            description: "This month",
            icon: <CircleCheckBig size={24} />,
          },
          {
            heading: "Late Arrivals",
            value: "2",
            description: "This month",
            icon: <CircleAlert size={24} />,
          },
          {
            heading: "Total Hours",
            value: "176",
            description: "This month",
            icon: <Clock4 size={24} />,
          },
        ]
      : [
          {
            heading: "Today's Attendance",
            value: "92%",
            description: "225/245 present",
            icon: <TrendingUp size={24} />,
          },
          {
            heading: "On Time",
            value: "215",
            description: "95% of present",
            icon: <CircleCheckBig size={24} />,
          },
          {
            heading: "Late Arrivals",
            value: "10",
            description: "5% of present",
            icon: <CircleAlert size={24} />,
          },
          {
            heading: "Absent",
            value: "20",
            description: "8% of workforce",
            icon: <Clock4 size={24} />,
          },
        ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">
        {role === "employee" ? "My Attendance" : "Attendance Dashboard"}
      </h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <MetricCard
            key={i}
            heading={m.heading}
            value={m.value}
            description={m.description}
            icon={m.icon}
          />
        ))}
      </div>

      {/* Table for HR/Admin */}
      {(role === "admin" || role === "hr") && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            All Employee Attendance
          </h3>
          <table className="w-full table-auto text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {[
                  "Name",
                  "Department",
                  "Clock In",
                  "Clock Out",
                  "Hours",
                  "Status",
                ].map((th) => (
                  <th key={th} className="px-3 py-2 text-left">
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(allEmployees) &&
                allEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{emp.name}</td>
                    <td className="px-3 py-2">{emp.dept}</td>
                    <td className="px-3 py-2">{emp.clockIn}</td>
                    <td className="px-3 py-2">{emp.clockOut}</td>
                    <td className="px-3 py-2">{emp.hours}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={emp.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table for Employee */}
      {role === "employee" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">My Attendance Records</h3>
          <table className="w-full table-auto text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {["Date", "Clock In", "Clock Out", "Hours", "Status"].map(
                  (th) => (
                    <th key={th} className="px-3 py-2 text-left">
                      {th}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {dailyRecords.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{r.date}</td>
                  <td className="px-3 py-2">{r.clockIn}</td>
                  <td className="px-3 py-2">{r.clockOut}</td>
                  <td className="px-3 py-2">{r.hours}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
const MetricCard = ({ heading, value, description, icon }) => (
  <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center">
    <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{heading}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const cls =
    status === "Present"
      ? "bg-green-100 text-green-700"
      : status === "Late"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Leave"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-600";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
};
