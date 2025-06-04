import React, { useState, useEffect } from "react";
import Layout from "../common/layout";
import {
  ListTodo,
  Clock,
  CheckSquare,
  Users,
  Calendar,
  AlertCircle,
  CircleCheckBig,
  FolderArchive,
  BarChart3,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

const TaskContent = () => {
  const [state, setState] = useState({
    tasks: [],
    users: [],
    loading: true,
    summary: {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      highPriority: 0,
    },
  });

  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const isAdminOrHr = role === "admin" || role === "hr";

  useEffect(() => {
    Promise.all([fetch("/tasks.json"), fetch("/data.json")])
      .then(([tasksRes, usersRes]) =>
        Promise.all([tasksRes.json(), usersRes.json()])
      )
      .then(([tasksData, userData]) => {
        // Filter tasks based on user role and email
        let filteredTasks = [];
        if (isAdminOrHr) {
          filteredTasks = tasksData.tasks;
        } else {
          // Show only tasks directly assigned to the user
          filteredTasks = tasksData.tasks.filter(
            (task) => task.assignedTo === email
          );
        }

        // Calculate summary for filtered tasks
        const summary = {
          totalTasks: filteredTasks.length,
          completedTasks: filteredTasks.filter(
            (task) => task.status === "Completed"
          ).length,
          pendingTasks: filteredTasks.filter(
            (task) => task.status === "In Progress"
          ).length,
          highPriority: filteredTasks.filter((task) => task.priority === "High")
            .length,
        };

        setState({
          tasks: filteredTasks,
          users: userData.users,
          loading: false,
          summary,
        });
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [email, isAdminOrHr]);

  const { tasks, users, loading, summary } = state;

  const getCollaboratorName = (collaboratorEmail) => {
    const user = users.find((u) => u.email === collaboratorEmail);
    return user ? user.name : collaboratorEmail;
  };

  const toggleProjectStatus = (projectId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === projectId) {
        const newStatus =
          task.status === "Completed" ? "In Progress" : "Completed";
        return { ...task, status: newStatus };
      }
      return task;
    });

    // Recalculate summary
    const newSummary = {
      totalTasks: updatedTasks.length,
      completedTasks: updatedTasks.filter((task) => task.status === "Completed")
        .length,
      pendingTasks: updatedTasks.filter((task) => task.status === "In Progress")
        .length,
      highPriority: updatedTasks.filter((task) => task.priority === "High")
        .length,
    };

    setState((prev) => ({
      ...prev,
      tasks: updatedTasks,
      summary: newSummary,
    }));
  };

  const cardData = [
    {
      title: "Total Tasks",
      value: summary.totalTasks,
      icon: ListTodo,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed Tasks",
      value: summary.completedTasks,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Tasks",
      value: summary.pendingTasks,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "High Priority",
      value: summary.highPriority,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const renderProjectCard = (project) => {
    const canToggleStatus = isAdminOrHr || project.assignedTo === email;

    return (
      <div
        key={project.id}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ListTodo className="w-6 h-6 text-blue-900 mr-3" />
            <h3 className="text-lg font-semibold text-blue-900">
              {project.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                project.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {project.status === "In Progress" ? (
                <Clock className="w-4 h-4 mr-1" />
              ) : (
                <CircleCheckBig className="w-4 h-4 mr-1" />
              )}
              {project.status}
            </span>
            {canToggleStatus && (
              <button
                onClick={() => toggleProjectStatus(project.id)}
                className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                  project.status === "In Progress"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
                title={
                  project.status === "In Progress"
                    ? "Mark as Completed"
                    : "Mark as In Progress"
                }
              >
                {project.status === "In Progress" ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reopen
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Duration: {project.startDate} to {project.endDate}
          </p>
          <p className="text-sm text-gray-700">{project.description}</p>
          <div className="flex flex-col space-y-2">
            <div className="flex items-start">
              <Users className="w-4 h-4 mr-2 mt-1 text-gray-500 flex-shrink-0" />
              <div>
                <strong className="text-sm text-gray-700">Team Members:</strong>
                {project.collaborators.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {project.collaborators.map((collaborator, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
                      >
                        {getCollaboratorName(collaborator)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 ml-1">
                    No collaborators
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : project.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {project.priority} Priority
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading projects...</div>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-blue-900" />
          {isAdminOrHr ? "All Projects" : "My Projects"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {card.title}
                </h3>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-700">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-900" />
              In Progress
            </h2>
            {tasks
              .filter((task) => task.status === "In Progress")
              .map(renderProjectCard)}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <FolderArchive className="w-6 h-6 mr-2 text-blue-900" />
              Completed
            </h2>
            {tasks
              .filter((task) => task.status === "Completed")
              .map(renderProjectCard)}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TaskContent;
