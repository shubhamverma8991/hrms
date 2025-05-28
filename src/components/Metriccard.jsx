import React, { useEffect } from "react";

const MetricCard = ({ heading, value, description, icon }) => {

//   useEffect(() => {
//     console.log('here', heading, value, description, icon);
//   }, []);

  return (
    <div className="relative bg-white shadow-md rounded-xl p-6 w-[20%] mx-2">
      {/* Icon in top-right */}
      <div className="absolute top-4 right-4 text-gray-700">
        {icon}
      </div>

      <div>
        <h2 className="text-gray-700 text-sm font-medium">{heading}</h2>
        <p className="text-2xl font-bold text-black mt-1">{value}</p>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
};

export default MetricCard;
