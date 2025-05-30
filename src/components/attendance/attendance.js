// src/components/attendance/Attendance.js
import React from "react";
import { Clock } from "lucide-react"; // Clock icon for attendance theme

const Attendance = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center border border-gray-200">
        <div className="flex justify-center mb-4">
          <Clock className="text-blue-500 w-16 h-16" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Attendance</h1>
        <p className="text-gray-600 mb-4">This feature is coming soon!</p>
        <p className="text-sm text-gray-400">
          We're working on the attendance module. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default Attendance;
