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
      { name: "Employees", path: "/employee" },
      { name: "Leave", path: "/leave" },
      { name: "Reports", path: "/reports" },
      { name: "Attendance", path: "/attendance" },
    ],
    hr: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Leave", path: "/leave" },
      { name: "Reports", path: "/reports" },
      { name: "Employees", path: "/employee" },
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
    <nav className="fixed w-full z-50 bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80 backdrop-blur-lg shadow-2xl border-b border-[#4B5EAA]">
      <div className="flex items-center space-x-4">
        {/* <span
          className="text-[#FFD700] font-extrabold text-2xl tracking-tight drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
          style={{
            textShadow: "0 2px 16px #FFD700, 0 1px 2px #000",
            letterSpacing: "0.1em",
          }}
          onClick={() => navigate("/")}
        >
          HR<span className="text-[#F5F5F5]">MS</span>
        </span> */}
      </div>
      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <span
            className="text-[#00246B] font-extrabold text-2xl tracking-tight drop-shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
            style={{
              letterSpacing: "0.1em",
            }}
            onClick={() => navigate("/")}
          >
            HR<span className="text-[#CADCFC]">MS</span>
          </span>
        </div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {navItems[role]?.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`relative text-[#CADCFC] font-medium px-3 py-2 rounded-lg transition
                hover:bg-[#00246B]/10 hover:text-[#00246B]
                ${
                  location.pathname === item.path
                    ? "ring-2 ring-[#CADCFC] bg-[#00246B]/10 text-[#00246B]"
                    : ""
                }
              `}
            >
              {iconMap[item.name]}
              {item.name}
              {location.pathname === item.path && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#F5F5F5] rounded-full"></span>
              )}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 text-[#CADCFC] bg-[#00246B] px-4 py-2 rounded-lg font-semibold shadow hover:text-[#CADCFC] bg-[#00246B] transition"
          >
            Logout
          </button>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#F5F5F5] focus:outline-none"
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
        className={`md:hidden fixed top-0 right-0 w-3/4 max-w-xs h-full bg-blue-900/95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ${
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
              className={`block text-left text-[#F5F5F5] font-medium px-3 py-2 rounded hover:bg-[#FFEA80]/10 hover:text-[#FFEA80] transition
                ${
                  location.pathname === item.path
                    ? "ring-2 ring-[#FFD700] bg-[#FFEA80]/10 text-[#FFEA80]"
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
            className="block text-left text-blue-900 bg-[#FFD700] px-3 py-2 rounded font-semibold hover:bg-[#FFEA80] transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
