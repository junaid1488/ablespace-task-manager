'use client';

import { Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';
import { cn, formatDate, isOverdue } from '@/lib/utils';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = task.status !== 'DONE' && isOverdue(task.dueDate);

  return (
    <Card className="relative p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">{task.title}</h3>
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Task actions"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border border-border bg-card py-1 shadow-md">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <div
        className={cn(
          'mt-3 flex items-center gap-1.5 text-xs text-muted-foreground',
          overdue && 'font-medium text-destructive',
        )}
      >
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(task.dueDate)}
        {overdue && ' · Overdue'}
      </div>
    </Card>
  );
}
