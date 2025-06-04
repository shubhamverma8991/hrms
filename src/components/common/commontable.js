import React from "react";

const CommonTable = ({ title, desc, columns, data }) => (
  <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
    {/* Header */}
    <div className="mb-6">
      {React.isValidElement(title) ? (
        title
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          {desc && <p className="text-gray-600">{desc}</p>}
        </>
      )}
    </div>

    {data?.length ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead>
            <tr>
              {columns.map(({ label, icon: Icon }, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50/50 backdrop-blur-sm first:rounded-tl-lg last:rounded-tr-lg"
                >
                  <div className="flex items-center space-x-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                    <span>{label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr
                key={idx}
                className="group transition-colors duration-200 hover:bg-blue-50/50"
              >
                {columns.map(({ key, render }, i) => (
                  <td
                    key={i}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200"
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
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          No {typeof title === "string" ? title.toLowerCase() : "data"}{" "}
          available.
        </p>
      </div>
    )}
  </div>
);

export default CommonTable;
