import { Search, SortAsc, SortDesc, X } from 'lucide-react';
import type { FilterState, Category, FilterStatus, FilterPriority, SortKey } from '../types';

interface FilterBarProps {
  filter: FilterState;
  setFilter: (f: FilterState) => void;
  categories: Category[];
  darkMode: boolean;
  totalCount: number;
}

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'todo', label: '未着手' },
  { value: 'in_progress', label: '進行中' },
  { value: 'done', label: '完了' },
];

const PRIORITY_OPTIONS: { value: FilterPriority; label: string }[] = [
  { value: 'all', label: '優先度' },
  { value: 'urgent', label: '緊急' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'order', label: '手動順' },
  { value: 'createdAt', label: '作成日' },
  { value: 'dueDate', label: '期限' },
  { value: 'priority', label: '優先度' },
  { value: 'title', label: 'タイトル' },
];

export function FilterBar({ filter, setFilter, categories, darkMode, totalCount }: FilterBarProps) {
  const update = (patch: Partial<FilterState>) => setFilter({ ...filter, ...patch });

  const inputCls = `text-sm rounded-lg px-2 py-1.5 border transition-colors focus:outline-none focus:ring-1 ${
    darkMode
      ? 'bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/30'
      : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30'
  }`;

  return (
    <div className={`rounded-2xl p-4 mb-4 ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="タスクを検索..."
            value={filter.search}
            onChange={e => update({ search: e.target.value })}
            className={`${inputCls} w-full pl-8 pr-8`}
          />
          {filter.search && (
            <button
              onClick={() => update({ search: '' })}
              className={`absolute right-2 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex rounded-lg overflow-hidden border border-slate-600/50">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update({ status: opt.value })}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter.status === opt.value
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={filter.priority}
          onChange={e => update({ priority: e.target.value as FilterPriority })}
          className={inputCls}
        >
          {PRIORITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Category filter */}
        <select
          value={filter.categoryId}
          onChange={e => update({ categoryId: e.target.value })}
          className={inputCls}
        >
          <option value="all">カテゴリ</option>
          <option value="">未分類</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <select
            value={filter.sortKey}
            onChange={e => update({ sortKey: e.target.value as SortKey })}
            className={inputCls}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => update({ sortDir: filter.sortDir === 'asc' ? 'desc' : 'asc' })}
            className={`p-1.5 rounded-lg border transition-colors ${
              darkMode
                ? 'border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                : 'border-slate-300 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {filter.sortDir === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>

        <span className={`text-xs ml-auto ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {totalCount}件
        </span>
      </div>
    </div>
  );
}
