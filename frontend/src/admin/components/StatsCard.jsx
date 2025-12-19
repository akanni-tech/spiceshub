export function StatsCard({ title, value, change, changeType, icon: Icon }) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-[#717182]",
  }[changeType];

  return (
    <div className="border border-[#F0F0F0] hover:border-[#99582A]/30 transition-colors rounded-lg bg-white">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#717182]">{title}</p>
            <h3 className="mt-2 text-[#333333]">{value}</h3>
            <p className={`text-sm mt-2 ${changeColor}`}>
              {change}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#FFE6A7] flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#99582A]" />
          </div>
        </div>
      </div>
    </div>
  );
}