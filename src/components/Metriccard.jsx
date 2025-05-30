import React from "react";

const MetricCard = ({ heading, value, description, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 m-4 flex items-center w-64">
      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-gray-500">{heading}</h3>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default MetricCard;
