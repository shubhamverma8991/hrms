import React from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar({ role }) {
  const navigate = useNavigate();

  const navItems = {
    admin: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Employees", path: "/employees" },
      { name: "Leave", path: "/leave" },
      { name: "Reports", path: "/reports" },
      { name: "Attendance", path: "/attendance" },
    ],
    hr: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Leave", path: "/leave" },
      { name: "Reports", path: "/reports" },
      { name: "Employees", path: "/employees" },
    ],
    employee: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Leave", path: "/leave" },
      { name: "Tasks", path: "/tasks" },
      { name: "Attendance", path: "/attendance" },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-4">
          {navItems[role]?.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
