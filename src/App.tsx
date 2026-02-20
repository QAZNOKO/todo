import { Moon, Sun, CheckSquare } from 'lucide-react';
import { useTodoStore } from './store/useTodoStore';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { Sidebar } from './components/Sidebar';
import type { Todo } from './types';

export default function App() {
  const {
    todos,
    allTodos,
    categories,
    filter,
    setFilter,
    darkMode,
    setDarkMode,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleStatus,
    reorderTodo,
    clearCompleted,
    addCategory,
    deleteCategory,
  } = useTodoStore();

  // Count todos per category for sidebar
  const todoCounts: Record<string, number> = { __uncategorized__: 0 };
  for (const cat of categories) todoCounts[cat.id] = 0;
  for (const t of allTodos) {
    if (t.categoryId && todoCounts[t.categoryId] !== undefined) {
      todoCounts[t.categoryId]++;
    } else if (!t.categoryId) {
      todoCounts['__uncategorized__']++;
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-slate-900 text-slate-100'
        : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 border-b backdrop-blur-md ${
        darkMode
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">TodoApp</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-colors ${
                darkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={darkMode ? 'ライトモード' : 'ダークモード'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <StatsBar stats={stats} darkMode={darkMode} />

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <Sidebar
                categories={categories}
                darkMode={darkMode}
                selectedCategoryId={filter.categoryId}
                onSelectCategory={id => setFilter({ ...filter, categoryId: id })}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
                todoCounts={todoCounts}
                totalCount={allTodos.length}
                onClearCompleted={clearCompleted}
                completedCount={stats.done}
              />
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AddTodoForm
              onAdd={addTodo}
              categories={categories}
              darkMode={darkMode}
            />

            <FilterBar
              filter={filter}
              setFilter={setFilter}
              categories={categories}
              darkMode={darkMode}
              totalCount={todos.length}
            />

            <TodoList
              todos={todos}
              categories={categories}
              darkMode={darkMode}
              onToggle={toggleStatus}
              onDelete={deleteTodo}
              onUpdate={(id, updates) => updateTodo(id, updates as Partial<Todo>)}
              onReorder={reorderTodo}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
