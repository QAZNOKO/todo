import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import type { Category, Priority } from '../types';

interface AddTodoFormProps {
  onAdd: (
    title: string,
    options: { description?: string; priority?: Priority; categoryId?: string; dueDate?: string }
  ) => void;
  categories: Category[];
  darkMode: boolean;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  urgent: { label: '緊急', color: 'text-red-400' },
  high: { label: '高', color: 'text-orange-400' },
  medium: { label: '中', color: 'text-yellow-400' },
  low: { label: '低', color: 'text-blue-400' },
};

export function AddTodoForm({ onAdd, categories, darkMode }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onAdd(t, {
      description: description.trim() || undefined,
      priority,
      categoryId: categoryId || undefined,
      dueDate: dueDate || undefined,
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    if (!expanded) return;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const inputBase = `w-full rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
    darkMode
      ? 'bg-slate-800 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'
  }`;

  return (
    <div className={`rounded-2xl p-4 mb-4 ${darkMode ? 'bg-slate-800/70 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="新しいタスクを追加... (Enter で追加)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${inputBase} px-4 py-2.5 text-sm flex-1`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setExpanded(p => !p)}
            className={`px-3 py-2.5 rounded-xl border text-sm transition-colors ${
              darkMode
                ? 'border-slate-600 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                : 'border-slate-300 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="詳細オプション"
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={18} />
            追加
          </button>
        </div>

        {expanded && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <textarea
              placeholder="説明 (任意)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className={`${inputBase} px-3 py-2 text-sm resize-none sm:col-span-2`}
            />

            {/* Priority */}
            <div>
              <label className={`block text-xs mb-1.5 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                優先度
              </label>
              <div className="flex gap-1.5">
                {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([val, cfg]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPriority(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      priority === val
                        ? `${cfg.color} border-current bg-current/10`
                        : darkMode
                          ? 'border-slate-600 text-slate-500 hover:border-slate-500'
                          : 'border-slate-300 text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={`block text-xs mb-1.5 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                カテゴリ
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className={`${inputBase} px-3 py-1.5 text-sm`}
              >
                <option value="">未分類</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Due date */}
            <div className="sm:col-span-2">
              <label className={`block text-xs mb-1.5 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Calendar size={12} className="inline mr-1" />
                期限
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`${inputBase} px-3 py-1.5 text-sm`}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
