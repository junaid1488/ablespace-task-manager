import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/tasks/status-badge';
import { PriorityBadge } from '@/components/tasks/priority-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ListChecks } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Task } from '@/types/task';

interface RecentTasksProps {
  tasks?: Task[];
  isLoading: boolean;
}

export function RecentTasks({ tasks, isLoading }: RecentTasksProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Recent Tasks</CardTitle>
        <Link href="/tasks" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}

        {!isLoading && (!tasks || tasks.length === 0) && (
          <EmptyState icon={ListChecks} title="No tasks yet" description="Create your first task to get started." />
        )}

        {!isLoading &&
          tasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{task.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
