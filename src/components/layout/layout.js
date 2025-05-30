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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar role={role} />
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
