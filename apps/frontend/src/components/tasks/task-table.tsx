'use client';

import { Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';
import { cn, formatDate, isOverdue } from '@/lib/utils';
import type { Task } from '@/types/task';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Due Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const overdue = task.status !== 'DONE' && isOverdue(task.dueDate);
              return (
                <tr key={task.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{task.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className={cn('px-5 py-3.5', overdue && 'font-medium text-destructive')}>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="relative px-5 py-3.5 text-right">
                    <button
                      onClick={() => setOpenMenuId((id) => (id === task.id ? null : task.id))}
                      aria-label="Task actions"
                      className="rounded-md p-1 text-muted-foreground hover:bg-muted"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openMenuId === task.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-5 top-11 z-20 w-36 rounded-lg border border-border bg-card py-1 text-left shadow-md">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onEdit(task);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onDelete(task);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
