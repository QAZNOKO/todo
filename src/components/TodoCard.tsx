import { useState } from 'react';
import {
  CheckCircle2, Circle, Clock, Trash2, Edit3,
  Calendar, Tag, GripVertical, X, Check, ChevronDown, ChevronUp
} from 'lucide-react';
import type { Todo, Category, Priority, Status } from '../types';

interface TodoCardProps {
  todo: Todo;
  categories: Category[];
  darkMode: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; dot: string; badge: string }> = {
  urgent: { label: '緊急', dot: 'bg-red-500', badge: 'text-red-400 bg-red-400/10 border-red-400/30' },
  high: { label: '高', dot: 'bg-orange-500', badge: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  medium: { label: '中', dot: 'bg-yellow-500', badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
  low: { label: '低', dot: 'bg-blue-500', badge: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
};

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; color: string }> = {
  todo: { label: '未着手', icon: <Circle size={14} />, color: 'text-slate-400' },
  in_progress: { label: '進行中', icon: <Clock size={14} />, color: 'text-yellow-400' },
  done: { label: '完了', icon: <CheckCircle2 size={14} />, color: 'text-emerald-400' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}

function isOverdue(dueDate: string, status: Status): boolean {
  return status !== 'done' && new Date(dueDate) < new Date();
}

export function TodoCard({
  todo,
  categories,
  darkMode,
  onToggle,
  onDelete,
  onUpdate,
  isDragging,
  dragHandleProps,
}: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategoryId, setEditCategoryId] = useState(todo.categoryId ?? '');
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? '');
  const [editStatus, setEditStatus] = useState<Status>(todo.status);
  const [expanded, setExpanded] = useState(false);

  const category = categories.find(c => c.id === todo.categoryId);
  const pCfg = PRIORITY_CONFIG[todo.priority];
  const sCfg = STATUS_CONFIG[todo.status];
  const overdue = todo.dueDate && isOverdue(todo.dueDate, todo.status);

  const saveEdit = () => {
    const t = editTitle.trim();
    if (!t) return;
    onUpdate(todo.id, {
      title: t,
      description: editDesc.trim(),
      priority: editPriority,
      categoryId: editCategoryId || null,
      dueDate: editDueDate || null,
      status: editStatus,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description);
    setEditPriority(todo.priority);
    setEditCategoryId(todo.categoryId ?? '');
    setEditDueDate(todo.dueDate ?? '');
    setEditStatus(todo.status);
    setIsEditing(false);
  };

  const inputBase = `w-full rounded-lg border transition-colors focus:outline-none focus:ring-1 text-sm ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20'
      : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20'
  }`;

  const cardBase = `relative rounded-2xl border transition-all duration-200 ${
    isDragging ? 'opacity-50 scale-95' : ''
  } ${
    todo.status === 'done'
      ? darkMode
        ? 'bg-slate-800/30 border-slate-700/30'
        : 'bg-slate-50 border-slate-200'
      : darkMode
        ? 'bg-slate-800 border-slate-700/70 hover:border-slate-600'
        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
  }`;

  return (
    <div className={cardBase}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div
            {...dragHandleProps}
            className={`mt-0.5 cursor-grab active:cursor-grabbing ${darkMode ? 'text-slate-600 hover:text-slate-400' : 'text-slate-300 hover:text-slate-500'} transition-colors flex-shrink-0`}
          >
            <GripVertical size={16} />
          </div>

          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo.id)}
            className={`mt-0.5 flex-shrink-0 transition-colors ${sCfg.color} hover:opacity-80`}
          >
            {sCfg.icon}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className={`${inputBase} px-3 py-1.5 font-medium`}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                />
                <textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="説明"
                  rows={2}
                  className={`${inputBase} px-3 py-1.5 resize-none`}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as Status)}
                    className={`${inputBase} px-2 py-1.5`}
                  >
                    <option value="todo">未着手</option>
                    <option value="in_progress">進行中</option>
                    <option value="done">完了</option>
                  </select>
                  <select
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value as Priority)}
                    className={`${inputBase} px-2 py-1.5`}
                  >
                    <option value="urgent">緊急</option>
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                  <select
                    value={editCategoryId}
                    onChange={e => setEditCategoryId(e.target.value)}
                    className={`${inputBase} px-2 py-1.5`}
                  >
                    <option value="">未分類</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={e => setEditDueDate(e.target.value)}
                    className={`${inputBase} px-2 py-1.5`}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg transition-colors"
                  >
                    <Check size={12} /> 保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                      darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <X size={12} /> キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className={`font-medium text-sm leading-snug ${
                  todo.status === 'done'
                    ? darkMode ? 'line-through text-slate-500' : 'line-through text-slate-400'
                    : darkMode ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  {todo.title}
                </p>
                {todo.description && (
                  <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {expanded || todo.description.length <= 80
                      ? todo.description
                      : todo.description.slice(0, 80) + '…'}
                    {todo.description.length > 80 && (
                      <button
                        onClick={() => setExpanded(p => !p)}
                        className={`ml-1 ${darkMode ? 'text-blue-400' : 'text-blue-500'} hover:underline`}
                      >
                        {expanded ? '折りたたむ' : 'もっと見る'}
                      </button>
                    )}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {/* Priority badge */}
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${pCfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
                    {pCfg.label}
                  </span>

                  {/* Category badge */}
                  {category && (
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                      style={{
                        color: category.color,
                        borderColor: category.color + '50',
                        backgroundColor: category.color + '15',
                      }}
                    >
                      <Tag size={10} />
                      {category.icon} {category.name}
                    </span>
                  )}

                  {/* Due date */}
                  {todo.dueDate && (
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
                      overdue
                        ? 'text-red-400 bg-red-400/10 border-red-400/30'
                        : darkMode
                          ? 'text-slate-400 bg-slate-700 border-slate-600'
                          : 'text-slate-500 bg-slate-100 border-slate-200'
                    }`}>
                      <Calendar size={10} />
                      {formatDate(todo.dueDate)}
                      {overdue && ' (超過)'}
                    </span>
                  )}

                  {/* Status */}
                  <span className={`inline-flex items-center gap-1 text-xs ${sCfg.color}`}>
                    {sCfg.icon}
                    {sCfg.label}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setExpanded(p => !p)}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="ステータス変更"
              >
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-700' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100'
                }`}
                title="編集"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-700' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
                }`}
                title="削除"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Quick status change */}
        {expanded && !isEditing && (
          <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <div className="flex gap-2">
              {(['todo', 'in_progress', 'done'] as Status[]).map(s => {
                const scfg = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => onUpdate(todo.id, { status: s })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      todo.status === s
                        ? `${scfg.color} border-current bg-current/10`
                        : darkMode
                          ? 'border-slate-600 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                          : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                    }`}
                  >
                    {scfg.icon}
                    {scfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
