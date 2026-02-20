export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in_progress' | 'done';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  categoryId: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  order: number;
}

export type FilterStatus = 'all' | Status;
export type FilterPriority = 'all' | Priority;
export type SortKey = 'createdAt' | 'dueDate' | 'priority' | 'title' | 'order';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  status: FilterStatus;
  priority: FilterPriority;
  categoryId: string | 'all';
  search: string;
  sortKey: SortKey;
  sortDir: SortDir;
}
