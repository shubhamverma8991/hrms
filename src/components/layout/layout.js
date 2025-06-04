import React, { useEffect, useState } from "react";
import NavBar from "../common/NavBar";

const Layout = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  if (!role) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <NavBar role={role} />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-circle bg-blue-400/20 w-64 h-64 rounded-full absolute -top-20 -left-20"></div>
        <div className="floating-circle-reverse bg-purple-400/20 w-96 h-96 rounded-full absolute -bottom-32 -right-32"></div>
      </div>

      {/* Main content */}
      <div className="flex-grow pt-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-lg bg-white/90 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
            {children}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <div className="backdrop-blur-md bg-white/30 px-6 py-3 rounded-full inline-block">
          <p className="text-white text-sm">
            &copy; {new Date().getFullYear()} KLNOTINPLAYOFF Pvt. Ltd. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
