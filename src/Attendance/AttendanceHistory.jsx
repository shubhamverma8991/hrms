import { useEffect, useState } from "react";
import axios from "axios";

export default function AttendanceHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // axios.get("/api/attendance/history").then((res) => setHistory(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Attendance History</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-2 py-1">Date</th>
            <th className="border border-gray-300 px-2 py-1">Check-In</th>
            <th className="border border-gray-300 px-2 py-1">Check-Out</th>
            <th className="border border-gray-300 px-2 py-1">Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => (
            <tr key={record.id}>
              <td className="border border-gray-300 px-2 py-1">{record.date}</td>
              <td className="border border-gray-300 px-2 py-1">{record.checkInTime}</td>
              <td className="border border-gray-300 px-2 py-1">{record.checkOutTime}</td>
              <td className="border border-gray-300 px-2 py-1">{record.totalHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


