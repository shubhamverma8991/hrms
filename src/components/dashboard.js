import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ role }) => {
  const navigate = useNavigate();
  const navItems = {
    admin: ['Dashboard', 'Users', 'Reports', 'Settings', 'Admin Tools'],
    hr: ['Dashboard', 'Employees', 'Leave Requests', 'Reports'],
    employee: ['Dashboard', 'My Profile', 'Tasks'],
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <ul className="flex space-x-4">
        {navItems[role]?.map((item) => (
          <li key={item} className="cursor-pointer hover:text-blue-200">{item}</li>
        ))}
        <li className="ml-auto cursor-pointer hover:text-blue-200" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </nav>
  );
};

const DashboardContent = ({ role }) => {
  const email = localStorage.getItem('email');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="text-gray-600 mb-6">Logged in as: {email} ({role})</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Role-specific dashboard cards */}
        {role === 'admin' && (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">System Overview</h2>
              <p className="text-gray-600">Monitor system performance</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">User Management</h2>
              <p className="text-gray-600">Manage user accounts</p>
            </div>
          </>
        )}
        
        {role === 'hr' && (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Employee Overview</h2>
              <p className="text-gray-600">View employee statistics</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Leave Requests</h2>
              <p className="text-gray-600">Manage employee leave requests</p>
            </div>
          </>
        )}
        
        {role === 'employee' && (
          <>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">My Tasks</h2>
              <p className="text-gray-600">View your assigned tasks</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-2">Leave Balance</h2>
              <p className="text-gray-600">Check your leave balance</p>
            </div>
          </>
        )}
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Notifications</h2>
          <p className="text-gray-600">You have 3 new messages</p>
        </div>
      </div>
    </div>
  );
};
// eslint-disable-next-line no-unused-vars
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => {
        console.error('Failed to load user data:', err);
        alert('Error loading user data.');
      });
  }, []);

  const handleLogin = () => {
    setIsLoading(true);

    setTimeout(() => {
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        onLogin(user.role);
        localStorage.setItem('role', user.role);
      } else {
        alert('Invalid credentials!');
      }

      setIsLoading(false);
    }, );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 max-w-sm mx-auto">
      <h2 className="text-2xl mb-6 font-semibold">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-3 mb-4 rounded w-full"
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3 mb-6 rounded w-full"
        disabled={isLoading}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded w-full hover:bg-blue-700 transition"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          'Login'
        )}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (!userRole) {
      navigate('/login');
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  if (!role) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar role={role} />
      <DashboardContent role={role} />
    </div>
  );
};

export default Dashboard;
