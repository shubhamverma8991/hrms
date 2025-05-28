const OnboardItem = ({ name, title, status }) => {
    const statusStyles = {
      'Complete': 'bg-green-100 text-green-700',
      'In Progress': 'bg-yellow-100 text-yellow-800',
    };
    return (
      <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <div>
          <p className="font-medium text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full ${statusStyles[status]}`}>{status}</span>
      </div>
    );
  };
  export default OnboardItem;