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
  Search,
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
  Search,
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
    searchQuery: "",
    activeFilter: "all",
  });

  const {
    summary,
    employees,
    loading,
    editingEmployee,
    formData,
    icons,
    searchQuery,
    activeFilter,
  } = state;
  const isAdmin = role === "admin";
  const isHR = role === "hr";
  const currentUserEmail = localStorage.getItem("email");

  useEffect(() => {
    Promise.all([
      fetch("/icons.json").then((res) => res.json()),
      fetch("/data.json").then((res) => res.json()),
    ])
      .then(([iconsData, data]) => {
        // Filter employees based on role
        let filteredEmployees = [];
        if (isAdmin || isHR) {
          filteredEmployees = data.users;
        } else {
          // If regular employee, only show their own data
          filteredEmployees = data.users.filter(
            (user) => user.email === currentUserEmail
          );
        }

        // Calculate summary based on filtered employees
        const activeEmployees = filteredEmployees.filter(
          (emp) => emp.status === "Active"
        );
        const summary = {
          totalEmployees: filteredEmployees.length,
          activeEmployees: activeEmployees.length,
          inactiveEmployees: filteredEmployees.length - activeEmployees.length,
          departments: new Set(filteredEmployees.map((emp) => emp.department))
            .size,
        };

        setState((prev) => ({
          ...prev,
          icons: iconsData,
          summary: summary,
          employees: filteredEmployees,
          loading: false,
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [isAdmin, isHR, currentUserEmail]);

  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  const updateEmployees = (updatedEmployees) => {
    const activeEmployees = updatedEmployees.filter(
      (emp) => emp.status === "Active"
    );
    const summary = {
      totalEmployees: updatedEmployees.length,
      activeEmployees: activeEmployees.length,
      inactiveEmployees: updatedEmployees.length - activeEmployees.length,
      departments: new Set(updatedEmployees.map((emp) => emp.department)).size,
    };
    updateState({
      employees: updatedEmployees,
      summary,
    });
  };

  const handleAction = {
    edit: (employee) => {
      // Only allow editing if admin/HR or if it's the user's own data
      if (isAdmin || isHR || employee.email === currentUserEmail) {
        updateState({
          editingEmployee: employee.id,
          formData: { ...employee },
        });
      }
    },
    save: (id) => {
      const employee = employees.find((emp) => emp.id === id);
      // Only allow saving if admin/HR or if it's the user's own data
      if (isAdmin || isHR || employee?.email === currentUserEmail) {
        updateEmployees(
          employees.map((emp) =>
            emp.id === id ? { ...emp, ...formData } : emp
          )
        );
        updateState({ editingEmployee: null });
      }
    },
    delete: (id) => {
      // Only admin can delete
      if (
        isAdmin &&
        window.confirm("Are you sure you want to delete this employee?")
      ) {
        updateEmployees(employees.filter((emp) => emp.id !== id));
      }
    },
    toggleStatus: (id) => {
      // Only admin can toggle status
      if (isAdmin) {
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
      }
    },
    add: () => {
      // Only admin can add new employees
      if (isAdmin) {
        const newId = `EMP${(employees.length + 1)
          .toString()
          .padStart(3, "0")}`;
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
      }
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
          {/* Show edit button if admin/HR or if it's the user's own data */}
          {(isAdmin || isHR || employee.email === currentUserEmail) && (
            <button
              onClick={() => handleAction.edit(employee)}
              className="text-gray-600 hover:text-blue-900"
            >
              {icons.Edit &&
                React.createElement(iconMap[icons.Edit], {
                  className: "w-4 h-4",
                })}
            </button>
          )}
          {/* Only show delete and status toggle for admin */}
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

  const handleSearch = (e) => {
    setState((prev) => ({
      ...prev,
      searchQuery: e.target.value,
    }));
  };

  const handleFilterClick = (filter) => {
    setState((prev) => ({
      ...prev,
      activeFilter: filter,
      searchQuery: "",
    }));
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      String(employee.id).toLowerCase().includes(query) ||
      employee.name.toLowerCase().includes(query);

    switch (activeFilter) {
      case "active":
        return matchesSearch && employee.status === "Active";
      case "inactive":
        return matchesSearch && employee.status === "Inactive";
      default:
        return matchesSearch;
    }
  });

  if (loading || !icons.cardData) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const cardData = [
    {
      title: "Total Employees",
      desc: "employees",
      value: summary.totalEmployees,
      key: "totalEmployees",
      icon: "Users",
      filter: "all",
    },
    {
      title: "Active Employees",
      desc: "active employees",
      value: summary.activeEmployees,
      key: "activeEmployees",
      icon: "UserCheck",
      filter: "active",
    },
    {
      title: "Inactive Employees",
      desc: "inactive employees",
      value: summary.inactiveEmployees,
      key: "inactiveEmployees",
      icon: "UserX",
      filter: "inactive",
    },
    {
      title: "Departments",
      desc: "departments",
      value: summary.departments,
      key: "departments",
      icon: "Building",
    },
  ];

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
        {cardData.map(({ title, desc, value, key, icon, filter }) => (
          <div
            key={key}
            onClick={() => filter && handleFilterClick(filter)}
            className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              filter && activeFilter === filter
                ? "scale-105 shadow-lg bg-blue-50/50"
                : ""
            }`}
          >
            <CommonCard
              title={title}
              desc={`${value || 0} ${desc}`}
              icon={iconMap[icon]}
            />
          </div>
        ))}
      </div>

      <CommonTable
        title={
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Employee List
                {activeFilter !== "all" && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({activeFilter === "active" ? "Active" : "Inactive"}{" "}
                    employees only)
                  </span>
                )}
              </h2>
              <p className="text-gray-600">
                {isAdmin ? "View and manage" : "View and edit"} all employees in
                the organization.
              </p>
            </div>
            <div className="relative w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Employee ID or Name..."
                value={searchQuery}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
          </div>
        }
        columns={columns}
        data={filteredEmployees}
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
