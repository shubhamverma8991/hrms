import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Task = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [tasks, setTasks] = useState({ current: [], history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");
    if (!storedRole || storedRole !== "employee") {
      navigate("/login");
    } else {
      setRole(storedRole);
      setEmail(storedEmail);
    }
  }, [navigate]);

  useEffect(() => {
    if (!email) return;
    fetch("/tasks.json")
      .then((res) => res.json())
      .then((data) => {
        const employeeData = data.find((entry) => entry.email === email);
        if (employeeData) {
          setTasks({
            current: employeeData.currentProjects || [],
            history: employeeData.projectHistory || [],
          });
        } else {
          console.warn("No task data found for:", email);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading task data:", err);
        setLoading(false);
      });
  }, [email]);

  const renderProjects = (projects) =>
    projects.map((project, index) => (
      <div
        key={index}
        className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4"
      >
        <h3 className="text-lg font-semibold text-blue-900">{project.name}</h3>
        <p className="text-sm text-gray-600">
          Duration: {project.startDate} to {project.endDate || "Present"}
        </p>
        <p className="text-sm text-gray-700 mt-1">{project.description}</p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Team:</strong> {project.collaborators.join(", ")}
        </p>
      </div>
    ));

  if (loading) {
    return (
      <div className="text-center text-gray-500 pt-20">Loading projects...</div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">My Projects</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">
          Current Projects
        </h2>
        {tasks.current.length > 0 ? (
          renderProjects(tasks.current)
        ) : (
          <p className="text-gray-600">
            You are not assigned to any active projects.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">
          Project History
        </h2>
        {tasks.history.length > 0 ? (
          renderProjects(tasks.history)
        ) : (
          <p className="text-gray-600">No completed projects available.</p>
        )}
      </section>
    </>
  );
};

export default Task;
