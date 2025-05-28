import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";

const LeaveContent = ({ role }) => {
  const cardsData = {
    admin: [
      { title: "Pending Requests", desc: "View all pending leave requests." },
      { title: "Approved This Month", desc: "Overview of approved leaves." },
      {
        title: "Rejected This Month",
        desc: "Details of rejected leave requests.",
      },
      { title: "On Leave Today", desc: "Employees currently on leave." },
    ],
    hr: [
      { title: "Pending Requests", desc: "View all pending leave requests." },
      { title: "Approved This Month", desc: "Overview of approved leaves." },
      {
        title: "Rejected This Month",
        desc: "Details of rejected leave requests.",
      },
      { title: "On Leave Today", desc: "Employees currently on leave." },
    ],
    employee: [
      { title: "Available Leave", desc: "Check your current leave balance." },
      { title: "Pending Requests", desc: "Your pending leave requests." },
      { title: "Approved This Year", desc: "Leaves approved this year." },
      { title: "Sick Leave", desc: "Sick leave balance and usage." },
    ],
  };

  const renderFlexCards = () => {
    const cards = cardsData[role] || [];
    return cards.map(({ title, desc }, i) => (
      <Card key={i} title={title} desc={desc} />
    ));
  };

  const renderStretchCard = () => {
    if (role === "admin" || role === "hr") {
      return (
        <Card
          title="Leave Requests"
          desc="Detailed view and management of leave requests."
          stretch
        />
      );
    }
    if (role === "employee") {
      return (
        <Card
          title="My Leave History"
          desc="See your leave application history and status."
          stretch
        />
      );
    }
    return null;
  };

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

const Card = ({ title, desc, stretch }) => (
  <div className={`bg-white p-4 rounded-lg shadow ${stretch ? "w-full" : ""}`}>
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
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
      <NavBar role={role} />
      <div className="py-10">
        <LeaveContent role={role} />
      </div>
    </div>
  );
};

export default Leave;
