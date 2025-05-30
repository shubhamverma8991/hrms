import React, { useEffect, useState } from "react";
import NavBar from "../NavBar";

const Layout = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  if (!role) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar role={role} />
      <div className="pt-20 px-4 flex-grow">
        <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
          {children}
        </div>
      </div>
      <footer className="text-center text-sm text-gray-500 py-4">
        &copy; {new Date().getFullYear()} SHUBHCO Pvt. Ltd. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
