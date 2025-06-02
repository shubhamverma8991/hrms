import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListTodo,
  CheckSquare,
  XSquare,
  Clock,
  Tag,
  User,
  Calendar,
  CircleDot,
  MessageSquare,
  Edit,
  Trash,
  Plus,
  AlertCircle,
  Users,
  CircleCheckBig,
  FolderArchive,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import Layout from "../common/layout";
import CommonCard from "../common/commoncard";
import CommonTable from "../common/commontable";

const iconMap = {
  ListTodo,
  CheckSquare,
  XSquare,
  Clock,
  Tag,
  User,
  Calendar,
  CircleDot,
  MessageSquare,
  Edit,
  Trash,
  Plus,
  AlertCircle,
  Users,
  CircleCheckBig,
  FolderArchive,
  BarChart3,
  CheckCircle,
};

const INPUT_FIELDS = [
  { key: "title", label: "Title", icon: "ListTodo" },
  { key: "description", label: "Description", icon: "MessageSquare" },
  { key: "assignedTo", label: "Assigned To", icon: "User" },
  { key: "priority", label: "Priority", icon: "AlertCircle" },
];

const PRIORITY_STYLES = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
};

const Task = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role"));
  const [state, setState] = useState({
    summary: {},
    tasks: [],
    loading: true,
    editingTask: null,
    formData: {},
    icons: {},
  });

  const { summary, tasks, loading, editingTask, formData, icons } = state;
  const isAdmin = role === "admin";
  const isAdminOrHr = role === "admin" || role === "hr";

  useEffect(() => {
    if (!role) {
      navigate("/login");
      return;
    }
  }, [role, navigate]);

  useEffect(() => {
    Promise.all([
      fetch("/icons.json").then((res) => res.json()),
      fetch("/tasks.json").then((res) => res.json()),
    ])
      .then(([iconsData, { summary, tasks }]) => {
        setState((prev) => ({
          ...prev,
          icons: iconsData,
          summary,
          tasks,
          loading: false,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  const updateTasks = (updatedTasks) => {
    const completedTasks = updatedTasks.filter(
      (task) => task.status === "Completed"
    );
    updateState({
      tasks: updatedTasks,
      summary: {
        totalTasks: updatedTasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: updatedTasks.length - completedTasks.length,
        highPriority: updatedTasks.filter((task) => task.priority === "High")
          .length,
      },
    });
  };

  const handleAction = {
    edit: (task) =>
      updateState({
        editingTask: task.id,
        formData: { ...task },
      }),
    save: (id) => {
      updateTasks(
        tasks.map((task) => (task.id === id ? { ...task, ...formData } : task))
      );
      updateState({ editingTask: null });
    },
    delete: (id) => {
      if (window.confirm("Are you sure you want to delete this task?")) {
        updateTasks(tasks.filter((task) => task.id !== id));
      }
    },
    toggleStatus: (id) => {
      updateTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                status: task.status === "Completed" ? "Pending" : "Completed",
              }
            : task
        )
      );
    },
    add: () => {
      const newId = `TSK${(tasks.length + 1).toString().padStart(3, "0")}`;
      const newTask = {
        id: newId,
        title: "New Task",
        description: "Task description",
        assignedTo: "Unassigned",
        priority: "Medium",
        status: "Pending",
        dueDate: new Date().toISOString().split("T")[0],
      };
      updateTasks([...tasks, newTask]);
      updateState({
        editingTask: newId,
        formData: newTask,
      });
    },
  };

  const handleInputChange = (field, value) => {
    updateState({ formData: { ...formData, [field]: value } });
  };

  const renderInput = (key, value, task) =>
    editingTask === task.id ? (
      <input
        name={key}
        value={formData[key]}
        onChange={(e) => handleInputChange(key, e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
    ) : (
      value
    );

  const renderActions = (task) => (
    <div className="flex space-x-2">
      {editingTask === task.id ? (
        <button
          onClick={() => handleAction.save(task.id)}
          className="text-blue-900 bg-[#FFD700] px-2 py-1 rounded hover:bg-[#FFEA80] transition"
        >
          Save
        </button>
      ) : (
        <>
          <button
            onClick={() => handleAction.edit(task)}
            className="text-gray-600 hover:text-blue-900"
          >
            {icons.Edit &&
              React.createElement(iconMap[icons.Edit], { size: 20 })}
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => handleAction.delete(task.id)}
                className="text-gray-600 hover:text-red-600"
              >
                {icons.Trash &&
                  React.createElement(iconMap[icons.Trash], { size: 20 })}
              </button>
              <button
                onClick={() => handleAction.toggleStatus(task.id)}
                className="text-gray-600 hover:text-green-600"
              >
                {icons.CheckSquare &&
                  React.createElement(iconMap[icons.CheckSquare], { size: 20 })}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  const columns = [
    { label: "ID", key: "id", icon: icons.Tag ? iconMap[icons.Tag] : null },
    ...INPUT_FIELDS.map(({ key, label, icon }) => ({
      label,
      key,
      icon: icons[icon] ? iconMap[icons[icon]] : null,
      render: (value, task) => renderInput(key, value, task),
    })),
    {
      label: "Priority",
      key: "priority",
      icon: icons.AlertCircle ? iconMap[icons.AlertCircle] : null,
      render: (priority) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORITY_STYLES[priority]}`}
        >
          {priority}
        </span>
      ),
    },
    {
      label: "Status",
      key: "status",
      icon: icons.CircleDot ? iconMap[icons.CircleDot] : null,
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      label: "Due Date",
      key: "dueDate",
      icon: icons.Calendar ? iconMap[icons.Calendar] : null,
    },
    {
      label: "Actions",
      key: "actions",
      render: (_, task) => renderActions(task),
    },
  ];

  if (!role) return null;

  if (loading || !icons.cardData) {
    return (
      <Layout>
        <div className="text-center text-gray-600">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">
          {isAdminOrHr
            ? `${role === "admin" ? "Admin" : "HR"} Task Management`
            : "My Tasks"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {icons.cardData?.task?.summary?.map(({ title, desc, icon, key }) => {
            const IconComponent = iconMap[icon];
            return (
              <CommonCard
                key={title}
                title={title}
                desc={`${summary[key] || 0} ${desc}`}
                icon={IconComponent}
              />
            );
          })}
        </div>
        <CommonTable
          title={isAdminOrHr ? "Task List" : "My Task List"}
          desc={`${
            isAdminOrHr ? "View and manage" : "View and track"
          } all tasks in the organization.`}
          columns={columns}
          data={tasks}
        />
        {isAdmin && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAction.add}
              className="flex items-center text-blue-900 bg-[#FFD700] px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFEA80] transition"
            >
              {icons.Plus &&
                React.createElement(iconMap[icons.Plus], { size: 20 })}
              <span className="ml-2">Add Task</span>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Task;
