import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users2,
  CalendarDays,
  BarChart3,
  ClipboardList,
  ListTodo,
} from "lucide-react";
 
export default function NavBar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
 
  // Map nav items to Lucide icons
  const iconMap = {
    Dashboard: <Home className="inline mr-2 w-5 h-5" />,
    Employees: <Users2 className="inline mr-2 w-5 h-5" />,
    Leave: <CalendarDays className="inline mr-2 w-5 h-5" />,
    Reports: <BarChart3 className="inline mr-2 w-5 h-5" />,
    Attendance: <ClipboardList className="inline mr-2 w-5 h-5" />,
    Tasks: <ListTodo className="inline mr-2 w-5 h-5" />,
  };
 
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
      { name: "Leave", path: " /leave" },
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
    // <nav className="fixed w-full z-50 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-lg shadow-2xl border-b border-gray-700">
    <nav className="fixed w-full z-50 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-lg shadow-2xl border-b border-gray-700">
      {/* <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center"> */}
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <span
            className="text-cyan-400 font-extrabold text-2xl tracking-tight drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
            style={{
              textShadow: "0 2px 16px #06b6d4, 0 1px 2px #000",
              letterSpacing: "0.1em",
            }}
            onClick={() => navigate("/")}
          >
            HR<span className="text-white">MS</span>
          </span>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <span
            className="text-cyan-400 font-extrabold text-2xl tracking-tight drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
            style={{
              textShadow: "0 2px 16px #06b6d4, 0 1px 2px #000",
              letterSpacing: "0.1em",
            }}
            onClick={() => navigate("/")}
          >
            HR<span className="text-white">MS</span>
          </span>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {navItems[role]?.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`relative text-cyan-300 font-medium px-3 py-2 rounded-lg transition
                hover:bg-cyan-400/10 hover:text-white
                ${
                  location.pathname === item.path
                    ? "ring-2 ring-cyan-400 bg-cyan-400/10 text-white"
                    : ""
                }
              `}
            >
              {iconMap[item.name]}
              {item.name}
              {location.pathname === item.path && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full"></span>
              )}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 text-gray-900 bg-cyan-400 px-4 py-2 rounded-lg font-semibold shadow hover:bg-cyan-300 transition"
          >
            Logout
          </button>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-cyan-300 focus:outline-none"
          >
            {menuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-black/40 z-40 transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-gray-900/95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col px-6 py-8 space-y-2">
          {navItems[role]?.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setMenuOpen(false);
                navigate(item.path);
              }}
              className={`block text-left text-cyan-300 font-medium px-3 py-2 rounded hover:bg-cyan-400/10 hover:text-white transition
                ${
                  location.pathname === item.path
                    ? "ring-2 ring-cyan-400 bg-cyan-400/10 text-white"
                    : ""
                }
              `}
            >
              {iconMap[item.name]}
              {item.name}
            </button>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="block text-left text-gray-900 bg-cyan-400 px-3 py-2 rounded font-semibold hover:bg-cyan-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
 