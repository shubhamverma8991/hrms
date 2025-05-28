import React, { useState } from "react";

const AttendanceTable = () => {
  const records = [
    {
      date: "May 23, 2024",
      clockIn: "09:02 AM",
      clockOut: "05:30 PM",
      hours: "8.5",
      status: "Present",
    },
    {
      date: "May 22, 2024",
      clockIn: "08:58 AM",
      clockOut: "05:45 PM",
      hours: "8.8",
      status: "Present",
    },
    {
      date: "May 21, 2024",
      clockIn: "09:15 AM",
      clockOut: "05:30 PM",
      hours: "8.25",
      status: "Late",
    },
    {
      date: "May 20, 2024",
      clockIn: "08:45 AM",
      clockOut: "05:15 PM",
      hours: "8.5",
      status: "Present",
    },
    {
      date: "May 17, 2024",
      clockIn: "-",
      clockOut: "-",
      hours: "-",
      status: "Leave",
    },
  ];

  const [selectedDate, setSelectedDate] = useState("");
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">My Attendance Records</h2>
      <p className="text-gray-500 mb-4">
        View your daily attendance and time records
      </p>

      <input
        type="date"
        className="border rounded px-4 py-2 mb-4"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm font-semibold text-gray-600">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Clock In</th>
              <th className="px-4 py-2">Clock Out</th>
              <th className="px-4 py-2">Hours</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {records.map((record, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{record.date}</td>
                <td className="px-4 py-2">{record.clockIn || "-"}</td>
                <td className="px-4 py-2">{record.clockOut || "-"}</td>
                <td className="px-4 py-2">{record.hours || "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : record.status === "Late"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
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
  );
};

export default AttendanceTable;
