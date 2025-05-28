const InfoCard = ({ title, value, note }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
      <p className="text-sm text-gray-400">{note}</p>
    </div>
  );
  export default InfoCard;