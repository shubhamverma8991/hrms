const LeaveRequest = ({ name, details }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <div>
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{details}</p>
      </div>
      <div className="flex space-x-2">
        <button className="bg-green-100 text-green-700 px-2 py-1 rounded">✔</button>
        <button className="bg-red-100 text-red-700 px-2 py-1 rounded">✖</button>
      </div>
    </div>
  );
  export default LeaveRequest;
  