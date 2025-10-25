export default function MetricCard({ title, value, trend }) {
  const isPositive = trend.startsWith("+");

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <h4 className="text-gray-600 text-sm font-medium mb-2">{title}</h4>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <span
        className={`text-sm font-medium ${
          isPositive ? "text-green-600" : "text-red-500"
        }`}
      >
        {trend}
      </span>
    </div>
  );
}
