import React from "react";

const CommonCard = ({ title, desc, icon: Icon }) => (
  <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center">
    <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4">
      {Icon && <Icon size={24} />}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
  </div>
);

export default CommonCard;
