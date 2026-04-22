export const StatCard = ({ title, value, subtext }) => (
    <div className="bg-card-bg border border-slate-800 p-6 rounded-2xl shadow-xl">
        <p className="text-slate-400 text-sm font-medium mb-1 uppercase">{title}</p>
        <h2 className="text-3xl font-bold text-white mb-2">{value}</h2>
        <p className="text-xs text-slate-500 italic">{subtext}</p>
    </div>
);