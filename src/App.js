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
import Dashboard from "./components/dashboard";
import Leave from "./components/leave/leave";
import Employee from "./components/employee/employee";
import Layout from "./components/layout/layout";
import Task from "./components/tasks/task";
import Report from "./components/report/report";
import Attendance from "../src/Attendance/Attendancee"
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
              <Route
                path="/dashboard"
                element={
                  <Layout role={role}>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/leave"
                element={
                  <Layout role={role}>
                    <Leave />
                  </Layout>
                }
              />
              <Route
                path="/employee"
                element={
                  <Layout role={role}>
                    <Employee />
                  </Layout>
                }
              />
              <Route
                path="/tasks"
                element={
                  <Layout role={role}>
                    <Task />
                  </Layout>
                }
              />
              <Route
                path="/reports"
                element={
                  <Layout role={role}>
                    <Report />
                  </Layout>
                }
              />
              <Route
                path="/attendance"
                element={
                  <Layout role={role}>
                  <Attendance role={role}/>
                  </Layout>
                }
              />
            </>
          )}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
