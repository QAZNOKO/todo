import { CheckCircle2, Circle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';

interface Stats {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  overdue: number;
}

interface StatsBarProps {
  stats: Stats;
  darkMode: boolean;
}

export function StatsBar({ stats, darkMode }: StatsBarProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const items = [
    { icon: <BarChart3 size={16} />, label: '合計', value: stats.total, color: darkMode ? 'text-slate-300' : 'text-slate-600' },
    { icon: <Circle size={16} />, label: '未着手', value: stats.todo, color: 'text-blue-400' },
    { icon: <Clock size={16} />, label: '進行中', value: stats.inProgress, color: 'text-yellow-400' },
    { icon: <CheckCircle2 size={16} />, label: '完了', value: stats.done, color: 'text-emerald-400' },
    { icon: <AlertTriangle size={16} />, label: '期限超過', value: stats.overdue, color: 'text-red-400' },
  ];

  return (
    <div className={`rounded-2xl p-4 mb-6 ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {items.map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={item.color}>{item.icon}</span>
              <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>
        {stats.total > 0 && (
          <div className="flex items-center gap-2">
            <div className={`w-32 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {completionRate}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
