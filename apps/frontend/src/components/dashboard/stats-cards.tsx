import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TaskStats } from '@/types/task';

interface StatsCardsProps {
  stats?: TaskStats;
  isLoading: boolean;
}

const items = [
  { key: 'total', label: 'Total Tasks', icon: Circle, color: 'text-primary' },
  { key: 'inProgress', label: 'In Progress', icon: Clock, color: 'text-warning' },
  { key: 'done', label: 'Completed', icon: CheckCircle2, color: 'text-success' },
  { key: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'text-destructive' },
] as const;

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              {isLoading ? (
                <Skeleton className="mt-2 h-7 w-10" />
              ) : (
                <p className="mt-1 text-2xl font-semibold">{stats?.[key] ?? 0}</p>
              )}
            </div>
            <div className="rounded-lg bg-muted p-2.5">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
