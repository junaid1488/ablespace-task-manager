'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentTasks } from '@/components/dashboard/recent-tasks';
import { useTaskStats, useTasks } from '@/hooks/use-tasks';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useTaskStats();
  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    page: 1,
    limit: 5,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s an overview of your tasks.</p>
      </div>

      <StatsCards stats={stats} isLoading={statsLoading} />

      <RecentTasks tasks={tasksData?.data} isLoading={tasksLoading} />
    </div>
  );
}
