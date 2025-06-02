import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  FileText,
  ListTodo,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  BarChart3,
  ClipboardList,
} from "lucide-react";

const menuItems = {
  admin: [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/employee", label: "Employees", icon: Users },
    { path: "/leave", label: "Leave Management", icon: FileText },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/attendance", label: "Attendance", icon: ClipboardList },
  ],
  hr: [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/employee", label: "Employees", icon: Users },
    { path: "/leave", label: "Leave Management", icon: FileText },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/attendance", label: "Attendance", icon: ClipboardList },
  ],
  employee: [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/leave", label: "My Leave", icon: FileText },
    { path: "/task", label: "My Projects", icon: ListTodo },
    { path: "/attendance", label: "My Attendance", icon: ClipboardList },
  ],
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const currentMenuItems = menuItems[role] || [];
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span
                  className="text-2xl font-bold text-blue-900 cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  HRMS
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {currentMenuItems.map(({ path, label, icon: Icon }) => (
                  <a
                    key={path}
                    href={path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(path);
                    }}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      currentPath === path
                        ? "text-blue-900 border-b-2 border-blue-900"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Dropdown and Mobile Menu Button */}
            <div className="flex items-center">
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <span className="h-8 w-8 rounded-full bg-blue-900 text-white flex items-center justify-center">
                      {username.charAt(0).toUpperCase()}
                    </span>
                    <span>{username}</span>
                    {ChevronDown && <ChevronDown className="w-4 h-4" />}
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {LogOut && <LogOut className="w-4 h-4 mr-2" />}
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  {isMobileMenuOpen
                    ? X && <X className="block h-6 w-6" />
                    : Menu && <Menu className="block h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {currentMenuItems.map(({ path, label, icon: Icon }) => (
                <a
                  key={path}
                  href={path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center px-4 py-2 text-base font-medium ${
                    currentPath === path
                      ? "bg-blue-50 border-blue-900 text-blue-900"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5 mr-3" />}
                  {label}
                </a>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
