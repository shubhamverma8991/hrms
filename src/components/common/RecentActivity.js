const RecentActivity = ({ icon, title, details, time }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <div>
        <p className="font-medium text-gray-800">{icon} {title}</p>
        <p className="text-sm text-gray-500">{details}</p>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  );
  export default RecentActivity;