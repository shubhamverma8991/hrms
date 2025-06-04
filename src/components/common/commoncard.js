import React from "react";

const CommonCard = ({ title, desc, icon: Icon }) => (
  <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105">
    {/* Background gradient animation */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

    {/* Content */}
    <div className="relative flex items-start space-x-4">
      {/* Icon container with animation */}
      <div className="flex-shrink-0">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
          {Icon && (
            <Icon
              size={24}
              className="text-blue-600 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
          {desc}
        </p>
      </div>
    </div>

    {/* Decorative elements */}
    <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full transform translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-500"></div>
  </div>
);

export default CommonCard;
