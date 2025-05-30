import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Clock4,
  CircleCheckBig,
  Users,
  Calendar,
  CheckSquare,
  ClipboardList,
  FolderArchive,
} from "lucide-react";

const TaskContent = () => {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState(null);
  const [tasks, setTasks] = useState({ current: [], history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    setEmail(storedEmail);
    setRole(storedRole);
  }, []);

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

  const handleMarkAsCompleted = (projectId) => {
    const updatedCurrent = tasks.current.filter(
      (project) => project.id !== projectId
    );
    const completedProject = tasks.current.find(
      (project) => project.id === projectId
    );
    if (completedProject) {
      completedProject.status = "Completed";
      completedProject.endDate = new Date().toISOString().split("T")[0];
      setTasks({
        current: updatedCurrent,
        history: [...tasks.history, completedProject],
      });
    }
  };

  const renderProjectCard = (project, isHistory = false) => (
    <div
      key={project.id}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ClipboardList className="w-6 h-6 text-blue-900 mr-3" />
          <h3 className="text-lg font-semibold text-blue-900">
            {project.name}
          </h3>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            project.status === "In Progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {project.status === "In Progress" ? (
            <Clock4 className="w-4 h-4 mr-1" />
          ) : (
            <CircleCheckBig className="w-4 h-4 mr-1" />
          )}
          {project.status}
        </span>
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-sm text-gray-600 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          Duration: {project.startDate} to {project.endDate || "Present"}
        </p>
        <p className="text-sm text-gray-700">{project.description}</p>
        <p className="text-sm text-gray-600 flex items-center">
          <Users className="w-4 h-4 mr-2 text-gray-500" />
          <strong>Team:</strong> {project.collaborators.join(", ")}
        </p>
      </div>
      {!isHistory &&
        role === "employee" &&
        project.status === "In Progress" && (
          <button
            onClick={() => handleMarkAsCompleted(project.id)}
            className="mt-4 flex items-center text-[#FFD700] bg-blue-900 px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition-colors duration-200"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Mark as Completed
          </button>
        )}
    </div>
  );

  if (loading) {
    return <div className="text-center text-gray-600">Loading projects...</div>;
  }

  if (!role) {
    return (
      <div className="text-center text-gray-600">
        Please log in to view your tasks.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
        <LayoutDashboard className="w-8 h-8 mr-3 text-blue-900" />
        My Projects
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <ClipboardList className="w-6 h-6 mr-2 text-blue-900" />
          Current Projects
        </h2>
        {tasks.current.length > 0 ? (
          tasks.current.map((project) => renderProjectCard(project))
        ) : (
          <p className="text-gray-600">
            You are not assigned to any active projects.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <FolderArchive className="w-6 h-6 mr-2 text-blue-900" />
          Project History
        </h2>
        {tasks.history.length > 0 ? (
          tasks.history.map((project) => renderProjectCard(project, true))
        ) : (
          <p className="text-gray-600">No completed projects available.</p>
        )}
      </section>
    </div>
  );
};

export default TaskContent;
