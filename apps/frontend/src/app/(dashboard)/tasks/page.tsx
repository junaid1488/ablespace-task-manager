'use client';

import { useState } from 'react';
import { LayoutGrid, ListChecks, Plus, TableProperties } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskTable } from '@/components/tasks/task-table';
import { TaskFormModal } from '@/components/tasks/task-form-modal';
import { DeleteConfirmModal } from '@/components/tasks/delete-confirm-modal';
import { useTasks } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';
import type { Task, TaskQuery } from '@/types/task';

export default function TasksPage() {
  const [query, setQuery] = useState<TaskQuery>({ page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc' });
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { data, isLoading } = useTasks(query);

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <span className="rounded-md bg-muted px-2 py-0.5 text-sm text-muted-foreground">
            {data?.meta.total ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              aria-label="Table view"
              onClick={() => setView('table')}
              className={cn(
                'rounded-md p-1.5',
                view === 'table' ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <TableProperties className="h-4 w-4" />
            </button>
            <button
              aria-label="Grid view"
              onClick={() => setView('grid')}
              className={cn(
                'rounded-md p-1.5',
                view === 'grid' ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <TaskFilters query={query} onChange={setQuery} />

      {isLoading && view === 'grid' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      )}
      {isLoading && view === 'table' && <Skeleton className="h-96 w-full" />}

      {!isLoading && (!data || data.data.length === 0) && (
        <EmptyState
          icon={ListChecks}
          title="No tasks found"
          description="Try adjusting your filters, or create a new task."
          action={
            <Button variant="outline" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create task
            </Button>
          }
        />
      )}

      {!isLoading && data && data.data.length > 0 && view === 'grid' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={openEdit} onDelete={setDeletingTask} />
          ))}
        </div>
      )}

      {!isLoading && data && data.data.length > 0 && view === 'table' && (
        <TaskTable tasks={data.data} onEdit={openEdit} onDelete={setDeletingTask} />
      )}

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={query.page === 1}
            onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={query.page === data.meta.totalPages}
            onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      <TaskFormModal open={formOpen} onClose={() => setFormOpen(false)} task={editingTask} />
      <DeleteConfirmModal task={deletingTask} onClose={() => setDeletingTask(null)} />
    </div>
  );
}
