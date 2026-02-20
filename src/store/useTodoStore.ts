import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Todo, Category, FilterState, Priority, Status } from '../types';

const TODOS_KEY = 'todos_v1';
const CATEGORIES_KEY = 'categories_v1';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '仕事', color: '#3b82f6', icon: '💼' },
  { id: 'personal', name: '個人', color: '#8b5cf6', icon: '👤' },
  { id: 'shopping', name: '買い物', color: '#10b981', icon: '🛒' },
  { id: 'health', name: '健康', color: '#ef4444', icon: '❤️' },
  { id: 'study', name: '学習', color: '#f59e0b', icon: '📚' },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useTodoStore() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    loadFromStorage<Todo[]>(TODOS_KEY, [])
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(CATEGORIES_KEY, DEFAULT_CATEGORIES)
  );
  const [filter, setFilter] = useState<FilterState>({
    status: 'all',
    priority: 'all',
    categoryId: 'all',
    search: '',
    sortKey: 'order',
    sortDir: 'asc',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    saveToStorage(TODOS_KEY, todos);
  }, [todos]);

  useEffect(() => {
    saveToStorage(CATEGORIES_KEY, categories);
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const addTodo = useCallback((
    title: string,
    options: Partial<Pick<Todo, 'description' | 'priority' | 'categoryId' | 'dueDate'>> = {}
  ) => {
    const maxOrder = todos.reduce((m, t) => Math.max(m, t.order), -1);
    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      description: options.description ?? '',
      status: 'todo',
      priority: options.priority ?? 'medium',
      categoryId: options.categoryId ?? null,
      dueDate: options.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      order: maxOrder + 1,
    };
    setTodos(prev => [...prev, newTodo]);
    return newTodo.id;
  }, [todos]);

  const updateTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos(prev => prev.map(t => {
      if (t.id !== id) return t;
      const isCompleting = updates.status === 'done' && t.status !== 'done';
      const isUncompleting = updates.status !== 'done' && t.status === 'done';
      return {
        ...t,
        ...updates,
        updatedAt: new Date().toISOString(),
        completedAt: isCompleting
          ? new Date().toISOString()
          : isUncompleting
            ? null
            : t.completedAt,
      };
    }));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setTodos(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nextStatus: Status = t.status === 'done' ? 'todo' : 'done';
      return {
        ...t,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        completedAt: nextStatus === 'done' ? new Date().toISOString() : null,
      };
    }));
  }, []);

  const reorderTodo = useCallback((fromId: string, toId: string) => {
    setTodos(prev => {
      const copy = [...prev];
      const fromIdx = copy.findIndex(t => t.id === fromId);
      const toIdx = copy.findIndex(t => t.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [item] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, item);
      return copy.map((t, i) => ({ ...t, order: i }));
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => t.status !== 'done'));
  }, []);

  const addCategory = useCallback((name: string, color: string, icon: string) => {
    const newCat: Category = { id: uuidv4(), name, color, icon };
    setCategories(prev => [...prev, newCat]);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setTodos(prev => prev.map(t =>
      t.categoryId === id ? { ...t, categoryId: null } : t
    ));
  }, []);

  const filteredTodos = todos.filter(t => {
    if (filter.status !== 'all' && t.status !== filter.status) return false;
    if (filter.priority !== 'all' && t.priority !== filter.priority) return false;
    if (filter.categoryId !== 'all' && t.categoryId !== filter.categoryId) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const PRIORITY_ORDER: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let cmp = 0;
    switch (filter.sortKey) {
      case 'order':
        cmp = a.order - b.order;
        break;
      case 'createdAt':
        cmp = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) cmp = 0;
        else if (!a.dueDate) cmp = 1;
        else if (!b.dueDate) cmp = -1;
        else cmp = a.dueDate.localeCompare(b.dueDate);
        break;
      case 'priority':
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'title':
        cmp = a.title.localeCompare(b.title, 'ja');
        break;
    }
    return filter.sortDir === 'asc' ? cmp : -cmp;
  });

  const stats = {
    total: todos.length,
    done: todos.filter(t => t.status === 'done').length,
    inProgress: todos.filter(t => t.status === 'in_progress').length,
    todo: todos.filter(t => t.status === 'todo').length,
    overdue: todos.filter(t =>
      t.dueDate &&
      t.status !== 'done' &&
      new Date(t.dueDate) < new Date()
    ).length,
  };

  return {
    todos: sortedTodos,
    allTodos: todos,
    categories,
    filter,
    setFilter,
    editingId,
    setEditingId,
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
  };
}
