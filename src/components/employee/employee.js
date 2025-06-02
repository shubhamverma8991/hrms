import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Building,
  Hash,
  User,
  Mail,
  Briefcase,
  CircleDot,
  Calendar,
  Edit,
  Trash,
  ToggleRight,
  UserPlus,
} from "lucide-react";
import Layout from "../common/layout";
import CommonCard from "../common/commoncard";
import CommonTable from "../common/commontable";

const iconMap = {
  Users,
  UserCheck,
  UserX,
  Building,
  Hash,
  User,
  Mail,
  Briefcase,
  CircleDot,
  Calendar,
  Edit,
  Trash,
  ToggleRight,
  UserPlus,
};

const INPUT_FIELDS = [
  { key: "name", label: "Name", icon: "User" },
  { key: "email", label: "Email", icon: "Mail" },
  { key: "department", label: "Department", icon: "Building" },
  { key: "position", label: "Position", icon: "Briefcase" },
];

const EmployeeContent = ({ role }) => {
  const [state, setState] = useState({
    summary: {},
    employees: [],
    loading: true,
    editingEmployee: null,
    formData: {},
    icons: {},
  });

  const { summary, employees, loading, editingEmployee, formData, icons } =
    state;
  const isAdmin = role === "admin";

  useEffect(() => {
    Promise.all([
      fetch("/icons.json").then((res) => res.json()),
      fetch("/employees.json").then((res) => res.json()),
    ])
      .then(([iconsData, { summary, employees }]) => {
        setState((prev) => ({
          ...prev,
          icons: iconsData,
          summary,
          employees,
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

  const updateEmployees = (updatedEmployees) => {
    const activeEmployees = updatedEmployees.filter(
      (emp) => emp.status === "Active"
    );
    updateState({
      employees: updatedEmployees,
      summary: {
        totalEmployees: updatedEmployees.length,
        activeEmployees: activeEmployees.length,
        inactiveEmployees: updatedEmployees.length - activeEmployees.length,
        departments: new Set(updatedEmployees.map((emp) => emp.department))
          .size,
      },
    });
  };

  const handleAction = {
    edit: (employee) =>
      updateState({
        editingEmployee: employee.id,
        formData: { ...employee },
      }),
    save: (id) => {
      updateEmployees(
        employees.map((emp) => (emp.id === id ? { ...emp, ...formData } : emp))
      );
      updateState({ editingEmployee: null });
    },
    delete: (id) => {
      if (window.confirm("Are you sure you want to delete this employee?")) {
        updateEmployees(employees.filter((emp) => emp.id !== id));
      }
    },
    toggleStatus: (id) => {
      updateEmployees(
        employees.map((emp) =>
          emp.id === id
            ? {
                ...emp,
                status: emp.status === "Active" ? "Inactive" : "Active",
              }
            : emp
        )
      );
    },
    add: () => {
      const newId = `EMP${(employees.length + 1).toString().padStart(3, "0")}`;
      const newEmployee = {
        id: newId,
        name: "New Employee",
        email: "new.employee@company.com",
        department: "Unassigned",
        position: "Unassigned",
        status: "Active",
        joined: new Date().toISOString().split("T")[0],
      };
      updateEmployees([...employees, newEmployee]);
      updateState({
        editingEmployee: newId,
        formData: newEmployee,
      });
    },
  };

  const handleInputChange = (field, value) => {
    updateState({ formData: { ...formData, [field]: value } });
  };

  const renderInput = (key, value, employee) =>
    editingEmployee === employee.id ? (
      <input
        name={key}
        value={formData[key]}
        onChange={(e) => handleInputChange(key, e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
    ) : (
      value
    );

  const renderActions = (employee) => (
    <div className="flex space-x-2">
      {editingEmployee === employee.id ? (
        <button
          onClick={() => handleAction.save(employee.id)}
          className="text-blue-900 bg-[#FFD700] px-2 py-1 rounded hover:bg-[#FFEA80] transition"
        >
          Save
        </button>
      ) : (
        <>
          <button
            onClick={() => handleAction.edit(employee)}
            className="text-gray-600 hover:text-blue-900"
          >
            {icons.Edit &&
              React.createElement(iconMap[icons.Edit], {
                className: "w-4 h-4",
              })}
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => handleAction.delete(employee.id)}
                className="text-gray-600 hover:text-red-600"
              >
                {icons.Trash &&
                  React.createElement(iconMap[icons.Trash], {
                    className: "w-4 h-4",
                  })}
              </button>
              <button
                onClick={() => handleAction.toggleStatus(employee.id)}
                className="text-gray-600 hover:text-green-600"
              >
                {icons.ToggleRight &&
                  React.createElement(iconMap[icons.ToggleRight], {
                    className: "w-4 h-4",
                  })}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  const columns = [
    { label: "ID", key: "id", icon: iconMap[icons.Hash] },
    ...INPUT_FIELDS.map(({ key, label, icon }) => ({
      label,
      key,
      icon: iconMap[icons[icon]],
      render: (value, employee) => renderInput(key, value, employee),
    })),
    {
      label: "Status",
      key: "status",
      icon: iconMap[icons.CircleDot],
      render: (status) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    { label: "Joined", key: "joined", icon: iconMap[icons.Calendar] },
    {
      label: "Actions",
      key: "actions",
      render: (_, employee) => renderActions(employee),
    },
  ];

  if (loading || !icons.cardData) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const cardData = icons.cardData.employee.summary;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isAdmin ? "Admin" : "HR"} Employee Management
        </h1>
        {isAdmin && (
          <button
            onClick={handleAction.add}
            className="flex items-center text-blue-900 bg-[#FFD700] px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFEA80] transition"
          >
            {icons.UserPlus &&
              React.createElement(iconMap[icons.UserPlus], {
                className: "inline mr-2 w-5 h-5",
              })}
            Add Employee
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {cardData.map(({ title, desc, icon, key }) => (
          <CommonCard
            key={title}
            title={title}
            desc={`${summary[key] || 0} ${desc}`}
            icon={iconMap[icon]}
          />
        ))}
      </div>
      <CommonTable
        title="Employee List"
        desc={`${
          isAdmin ? "View and manage" : "View and edit"
        } all employees in the organization.`}
        columns={columns}
        data={employees}
      />
    </div>
  );
};

const Employee = () => {
  const navigate = useNavigate();
  const [role] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (!role) navigate("/login");
  }, [role, navigate]);

  return (
    role && (
      <Layout>
        <EmployeeContent role={role} />
      </Layout>
    )
  );
};

export default Employee;
