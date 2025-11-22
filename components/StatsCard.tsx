import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  colorClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start justify-between transition-transform hover:scale-[1.01]">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        {trend && <p className="text-xs text-emerald-600 mt-2 font-medium">{trend}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass} text-white shadow-md`}>
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
