import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar";
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

const EmployeeContent = ({ role }) => {
  const [employeeData, setEmployeeData] = useState({
    summary: {},
    employees: [],
  });
  const [loading, setLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch("/employees.json")
      .then((response) => response.json())
      .then((data) => {
        setEmployeeData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        setLoading(false);
      });
  }, []);

  const cardTitles = [
    {
      title: "Total Employees",
      baseDesc: "Total number of employees.",
      icon: Users,
    },
    {
      title: "Active Employees",
      baseDesc: "Currently active employees.",
      icon: UserCheck,
    },
    {
      title: "Inactive Employees",
      baseDesc: "Currently inactive employees.",
      icon: UserX,
    },
    {
      title: "Departments",
      baseDesc: "Number of departments.",
      icon: Building,
    },
  ];

  const getDynamicDesc = (title) => {
    if (!employeeData.summary) return "";
    switch (title) {
      case "Total Employees":
        return `${
          employeeData.summary.totalEmployees || 0
        } employees in the organization.`;
      case "Active Employees":
        return `${
          employeeData.summary.activeEmployees || 0
        } employees currently active.`;
      case "Inactive Employees":
        return `${
          employeeData.summary.inactiveEmployees || 0
        } employees currently inactive.`;
      case "Departments":
        return `${
          employeeData.summary.departments || 0
        } departments in the organization.`;
      default:
        return "";
    }
  };

  const renderFlexCards = () => {
    return cardTitles.map(({ title, baseDesc, icon: Icon }, i) => (
      <Card
        key={i}
        title={title}
        desc={getDynamicDesc(title) || baseDesc}
        icon={<Icon className="inline mr-2 w-5 h-5 text-gray-700" />}
      />
    ));
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setFormData({ ...employee });
  };

  const handleSave = (id) => {
    const updatedEmployees = employeeData.employees.map((emp) =>
      emp.id === id ? { ...emp, ...formData } : emp
    );
    setEmployeeData({ ...employeeData, employees: updatedEmployees });
    setEditingEmployee(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const updatedEmployees = employeeData.employees.filter(
        (emp) => emp.id !== id
      );
      setEmployeeData({
        ...employeeData,
        employees: updatedEmployees,
        summary: {
          ...employeeData.summary,
          totalEmployees: updatedEmployees.length,
          activeEmployees: updatedEmployees.filter(
            (emp) => emp.status === "Active"
          ).length,
          inactiveEmployees: updatedEmployees.filter(
            (emp) => emp.status === "Inactive"
          ).length,
        },
      });
    }
  };

  const handleStatusToggle = (id) => {
    const updatedEmployees = employeeData.employees.map((emp) =>
      emp.id === id
        ? { ...emp, status: emp.status === "Active" ? "Inactive" : "Active" }
        : emp
    );
    setEmployeeData({
      ...employeeData,
      employees: updatedEmployees,
      summary: {
        ...employeeData.summary,
        activeEmployees: updatedEmployees.filter(
          (emp) => emp.status === "Active"
        ).length,
        inactiveEmployees: updatedEmployees.filter(
          (emp) => emp.status === "Inactive"
        ).length,
      },
    });
  };

  const handleAddEmployee = () => {
    const newId = `EMP${(employeeData.employees.length + 1)
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
    setEmployeeData({
      ...employeeData,
      employees: [...employeeData.employees, newEmployee],
      summary: {
        ...employeeData.summary,
        totalEmployees: employeeData.employees.length + 1,
        activeEmployees: employeeData.summary.activeEmployees + 1,
      },
    });
    setEditingEmployee(newId);
    setFormData(newEmployee);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderEmployeeTable = () => {
    if (!employeeData.employees || employeeData.employees.length === 0) {
      return <p className="text-gray-600">No employees available.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                <Hash className="inline mr-2 w-4 h-4" />
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                <User className="inline mr-2 w-4 h-4" />
                Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                <Mail className="inline mr-2 w-4 h-4" />
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                <Building className="inline mr-2 w-4 h-4" />
                Department
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                <Briefcase className="inline mr-2 w-4 h-4" />
                Position
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                <CircleDot className="inline mr-2 w-4 h-4" />
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                <Calendar className="inline mr-2 w-4 h-4" />
                Joined
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employeeData.employees.map((employee, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-sm text-gray-600">
                  {employee.id}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {editingEmployee === employee.id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    employee.name
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {editingEmployee === employee.id ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    employee.email
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {editingEmployee === employee.id ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    employee.department
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {editingEmployee === employee.id ? (
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    employee.position
                  )}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {employee.joined}
                </td>
                <td className="px-4 py-2 text-sm flex space-x-2">
                  {editingEmployee === employee.id ? (
                    <button
                      onClick={() => handleSave(employee.id)}
                      className="text-blue-900 bg-[#FFD700] px-2 py-1 rounded hover:bg-[#FFEA80] transition"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-gray-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {role === "admin" && (
                    <>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(employee.id)}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <ToggleRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {role === "admin" ? "Admin" : "HR"} Employee Management
        </h1>
        {role === "admin" && (
          <button
            onClick={handleAddEmployee}
            className="flex items-center text-blue-900 bg-[#FFD700] px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#FFEA80] transition"
          >
            <UserPlus className="inline mr-2 w-5 h-5" />
            Add Employee
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {renderFlexCards()}
      </div>
      <div className="bg-white p-4 rounded-lg shadow w-full">
        <h2 className="text-lg font-semibold mb-2">Employee List</h2>
        <p className="text-gray-600 mb-4">
          {role === "admin"
            ? "View and manage all employees in the organization."
            : "View and edit employee details."}
        </p>
        {renderEmployeeTable()}
      </div>
    </div>
  );
};

const Card = ({ title, desc, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="text-lg font-semibold mb-2 flex items-center">
      {icon}
      {title}
    </h2>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const Employee = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (!userRole || (userRole !== "admin" && userRole !== "hr")) {
      navigate("/login");
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  if (!role) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavBar role={role} />
      <div className="py-10">
        <EmployeeContent role={role} />
      </div>
    </div>
  );
};

export default Employee;
