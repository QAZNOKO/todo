import { useState } from 'react';
import { TodoCard } from './TodoCard';
import type { Todo, Category } from '../types';

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  darkMode: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onReorder: (fromId: string, toId: string) => void;
}

export function TodoList({
  todos,
  categories,
  darkMode,
  onToggle,
  onDelete,
  onUpdate,
  onReorder,
}: TodoListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  if (todos.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed ${
        darkMode ? 'border-slate-700 text-slate-600' : 'border-slate-200 text-slate-400'
      }`}>
        <div className="text-5xl mb-4">✅</div>
        <p className="text-lg font-medium">タスクがありません</p>
        <p className="text-sm mt-1 opacity-70">上のフォームから新しいタスクを追加してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <div
          key={todo.id}
          draggable
          onDragStart={() => setDraggingId(todo.id)}
          onDragEnd={() => {
            if (draggingId && dragOverId && draggingId !== dragOverId) {
              onReorder(draggingId, dragOverId);
            }
            setDraggingId(null);
            setDragOverId(null);
          }}
          onDragOver={e => {
            e.preventDefault();
            setDragOverId(todo.id);
          }}
          onDragLeave={() => setDragOverId(null)}
          className={`transition-all duration-150 ${
            dragOverId === todo.id && draggingId !== todo.id
              ? `rounded-2xl ring-2 ring-blue-500/50 ${darkMode ? 'bg-blue-500/5' : 'bg-blue-50'}`
              : ''
          }`}
        >
          <TodoCard
            todo={todo}
            categories={categories}
            darkMode={darkMode}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
            isDragging={draggingId === todo.id}
            dragHandleProps={{}}
          />
        </div>
      ))}
    </div>
  );
}
