'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { TaskQuery } from '@/types/task';

interface TaskFiltersProps {
  query: TaskQuery;
  onChange: (query: TaskQuery) => void;
}

export function TaskFilters({ query, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          className="pl-9"
          value={query.search ?? ''}
          onChange={(e) => onChange({ ...query, search: e.target.value, page: 1 })}
        />
      </div>
      <Select
        className="sm:w-40"
        value={query.status ?? ''}
        onChange={(e) => onChange({ ...query, status: (e.target.value || undefined) as any, page: 1 })}
      >
        <option value="">All statuses</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </Select>
      <Select
        className="sm:w-40"
        value={query.priority ?? ''}
        onChange={(e) => onChange({ ...query, priority: (e.target.value || undefined) as any, page: 1 })}
      >
        <option value="">All priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </Select>
      <Select
        className="sm:w-44"
        value={`${query.sortBy ?? 'createdAt'}:${query.sortOrder ?? 'desc'}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(':') as [TaskQuery['sortBy'], TaskQuery['sortOrder']];
          onChange({ ...query, sortBy, sortOrder });
        }}
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="dueDate:asc">Due date ↑</option>
        <option value="dueDate:desc">Due date ↓</option>
        <option value="priority:desc">Priority high→low</option>
        <option value="title:asc">Title A→Z</option>
      </Select>
    </div>
  );
}
