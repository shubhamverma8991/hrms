// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";
import Leave from "./components/leave/leave";
import Employee from "./components/employee/employee";
import TaskContent from "./components/task/task";
import Report from "./components/report/report";
import Attendance from "./components/Attendance/Attendancee";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          {role && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/task" element={<TaskContent />} />
              <Route path="/reports" element={<Report />} />
              <Route path="/attendance" element={<Attendance role={role} />} />
            </>
          )}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
