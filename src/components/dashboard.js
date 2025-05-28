// Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

// const NavBar = ({ role }) => {
//   const navigate = useNavigate();
//   const navItems = {
//     admin: ["Dashboard", "Employees", "Attendance", "Leave", "Reports", "Admin Tools"],
//     hr: ["Dashboard", "Employees", "Attendance", "Leave", "Reports"],
//     employee: ["Dashboard", "My Profile", "Tasks", "Leave Balance"],
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('role');
//     localStorage.removeItem('email');
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-indigo-600 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             {navItems[role]?.map((item) => (
//               <button
//                 key={item}
//                 onClick={() => navigate(`/${item.toLowerCase().replace(/\s+/g, '-')}`)}
//                 className="inline-flex items-center px-3 py-2 text-white hover:text-indigo-200 cursor-pointer"
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//           <div className="flex items-center">
//             <button onClick={handleLogout} className="text-white hover:text-indigo-200">
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };
import NavBar from './NavBar';
import InfoCard from './common/InfoCard';
import LeaveRequest from './common/LeaveRequest';
import OnboardItem from './common/OnboardItem';
import LeaveItem from './common/LeaveItem';
import ProfileRow from './common/ProfileRow';
import RecentActivity from './common/RecentActivity';

const DashboardContent = ({ role, data }) => {
  const email = localStorage.getItem('email');
  const cards = data?.infoCards?.[role] || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h1 className="text-2xl font-bold mb-4">
          {role === 'admin' ? 'Admin' : role === 'hr' ? 'HR Manager' : 'Employee'} Dashboard
        </h1>
        <p className="text-gray-600 mb-6">Logged in as: {email} ({role})</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <InfoCard key={i} {...card} />
          ))}
        </div>

        {role === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <div className="bg-gray-50 p-6 rounded-xl shadow flex flex-col items-center justify-center h-64">
              <span className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </span>
              <p className="text-gray-500">Department Distribution Chart</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              {data.recentActivities.map((activity, i) => (
                <RecentActivity key={i} {...activity} />
              ))}
            </div>
          </div>
        )}

        {role === 'hr' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Pending Leave Requests</h2>
              {data.leaveRequests.map((request, i) => (
                <LeaveRequest key={i} {...request} />
              ))}
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Onboarding</h2>
              {data.onboardItems.map((item, i) => (
                <OnboardItem key={i} {...item} />
              ))}
            </div>
          </div>
        )}

        {role === 'employee' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-semibold mb-4">My Leave Requests</h2>
              {data.leaveItems.map((item, i) => (
                <LeaveItem key={i} {...item} />
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-semibold mb-4">My Profile</h2>
              {Object.entries(data.profileInfo).map(([label, value]) => (
                <ProfileRow key={label} label={label.charAt(0).toUpperCase() + label.slice(1)} value={value} />
              ))}
              <button className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    if (!userRole) {
      navigate('/login');
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((json) => setData(json[0]))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  if (!role || !data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* <NavBar role={role} /> */}
      <NavBar role={role} />
      <DashboardContent role={role} data={data} />
    </div>
  );
};

export default Dashboard;
