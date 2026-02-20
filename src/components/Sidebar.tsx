import { useState } from 'react';
import { Plus, Trash2, FolderOpen, X, Check } from 'lucide-react';
import type { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  darkMode: boolean;
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: (name: string, color: string, icon: string) => void;
  onDeleteCategory: (id: string) => void;
  todoCounts: Record<string, number>;
  totalCount: number;
  onClearCompleted: () => void;
  completedCount: number;
}

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#ef4444',
  '#f59e0b', '#ec4899', '#06b6d4', '#84cc16',
];

const PRESET_ICONS = ['📁', '⭐', '🔥', '💡', '🎯', '🏠', '🌟', '📝', '🎮', '🚀'];

export function Sidebar({
  categories,
  darkMode,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  todoCounts,
  totalCount,
  onClearCompleted,
  completedCount,
}: SidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [newIcon, setNewIcon] = useState(PRESET_ICONS[0]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddCategory(newName.trim(), newColor, newIcon);
    setNewName('');
    setNewColor(PRESET_COLORS[0]);
    setNewIcon(PRESET_ICONS[0]);
    setIsAdding(false);
  };

  const itemCls = (active: boolean) =>
    `flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-colors group ${
      active
        ? 'bg-blue-600 text-white'
        : darkMode
          ? 'text-slate-400 hover:bg-slate-700/70 hover:text-slate-200'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
    }`;

  return (
    <div className={`w-56 flex-shrink-0 rounded-2xl p-3 ${
      darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-sm'
    }`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
        カテゴリ
      </p>

      {/* All */}
      <button
        onClick={() => onSelectCategory('all')}
        className={itemCls(selectedCategoryId === 'all')}
      >
        <span className="flex items-center gap-2">
          <FolderOpen size={14} />
          すべて
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-md ${
          selectedCategoryId === 'all'
            ? 'bg-white/20 text-white'
            : darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
        }`}>
          {totalCount}
        </span>
      </button>

      {/* Uncategorized */}
      <button
        onClick={() => onSelectCategory('')}
        className={itemCls(selectedCategoryId === '')}
      >
        <span className="flex items-center gap-2">
          <span>📂</span>
          未分類
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-md ${
          selectedCategoryId === ''
            ? 'bg-white/20 text-white'
            : darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
        }`}>
          {todoCounts['__uncategorized__'] ?? 0}
        </span>
      </button>

      {/* Categories */}
      {categories.map(cat => (
        <div key={cat.id} className="relative group/item">
          <button
            onClick={() => onSelectCategory(cat.id)}
            className={`${itemCls(selectedCategoryId === cat.id)} pr-8`}
          >
            <span className="flex items-center gap-2 min-w-0">
              <span>{cat.icon}</span>
              <span className="truncate">{cat.name}</span>
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 ${
              selectedCategoryId === cat.id
                ? 'bg-white/20 text-white'
                : darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              {todoCounts[cat.id] ?? 0}
            </span>
          </button>
          <button
            onClick={() => onDeleteCategory(cat.id)}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all ${
              darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-700' : 'text-slate-300 hover:text-red-500 hover:bg-slate-100'
            }`}
          >
            <Trash2 size={11} />
          </button>
        </div>
      ))}

      {/* Add category */}
      {isAdding ? (
        <div className={`mt-2 p-2 rounded-xl border ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
          <input
            type="text"
            placeholder="カテゴリ名"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setIsAdding(false);
            }}
            className={`w-full text-xs px-2 py-1.5 rounded-lg border mb-2 focus:outline-none focus:ring-1 ${
              darkMode
                ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
                : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'
            }`}
          />
          <div className="flex flex-wrap gap-1 mb-2">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full transition-transform ${newColor === c ? 'scale-125 ring-2 ring-offset-1 ring-current' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {PRESET_ICONS.map(ic => (
              <button
                key={ic}
                onClick={() => setNewIcon(ic)}
                className={`text-base leading-none p-0.5 rounded transition-transform ${newIcon === ic ? 'scale-125' : ''}`}
              >
                {ic}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors"
            >
              <Check size={10} /> 追加
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors ${
                darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <X size={10} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs mt-1 transition-colors ${
            darkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus size={13} />
          カテゴリを追加
        </button>
      )}

      {/* Clear completed */}
      {completedCount > 0 && (
        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
          >
            <Trash2 size={13} />
            完了タスクを削除 ({completedCount})
          </button>
        </div>
      )}
    </div>
  );
}
