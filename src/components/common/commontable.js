import React from "react";

const CommonTable = ({ title, desc, columns, data }) => (
  <div className="bg-white p-4 rounded-lg shadow w-full">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{desc}</p>
    {data?.length ? (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {columns.map(({ label, icon: Icon }, i) => (
                <th
                  key={i}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {Icon &&
                    React.createElement(Icon, {
                      className: "inline mr-2 w-4 h-4",
                    })}
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {columns.map(({ key, render }, i) => (
                  <td
                    key={i}
                    className={`px-4 py-2 text-sm ${
                      key === "status" || key === "actions"
                        ? ""
                        : "text-gray-600"
                    }`}
                  >
                    {render ? render(item[key], item) : item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-600">No {title.toLowerCase()} available.</p>
    )}
  </div>
);

export default CommonTable;
