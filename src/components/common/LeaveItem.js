const LeaveItem = ({ type, date, status }) => {
    const statusColors = {
      Approved: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return (
      <div className="flex justify-between items-center border-b py-3">
        <div>
          <p className="font-medium">{type}</p>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full ${statusColors[status]}`}>{status}</span>
      </div>
    );
  };
  export default LeaveItem;
  