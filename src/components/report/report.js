// src/components/reports/Report.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react"; // Install lucide-react if not already
import Layout from "../common/layout";

const Report = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (!role) {
      navigate("/login");
      return;
    }

    if (role === "employee") {
      navigate("/dashboard");
      return;
    }
  }, [role, navigate]);

  if (!role) return null;

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center border border-gray-200">
          <div className="flex justify-center mb-4">
            <AlertCircle className="text-yellow-500 w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports</h1>
          <p className="text-gray-600 mb-4">This feature is coming soon!</p>
          <p className="text-sm text-gray-400">
            We're working hard to bring this feature to life. Stay tuned!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Report;
