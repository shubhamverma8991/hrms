import React, { useState } from "react";
import MetricCard from "../Metriccard.jsx";
import { TrendingUp } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import { CircleAlert } from "lucide-react";
import { Clock4 } from "lucide-react";

const AttendanceDashboard = () => {
  // const [selectedDate, setSelectedDate] = useState("");
  const MetricData = [
    {
      heading: "Attendance Rate",
      value: "98.5%",
      description: "Above department average",
      icon: <TrendingUp />,
    },
    {
      heading: "Days Present",
      value: "22",
      description: "This Month",
      icon: <CircleCheckBig />,
    },
    {
      heading: "Late Arrivals",
      value: "2",
      description: "This Month",
      icon: <CircleAlert />,
    },

    {
      heading: "Total Hours",
      value: "176",
      description: "This Month",
      icon: <Clock4 />,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Attendance</h2>

      <div className="mb-6">
        <div className="flex flex-wrap flex-row justify-center align-center ">
          {MetricData.map((item) => {
            return (
              <MetricCard
                heading={item.heading}
                value={item.value}
                description={item.description}
                icon={item.icon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
