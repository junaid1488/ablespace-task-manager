import { Badge } from '@/components/ui/badge';
import type { TaskPriority } from '@/types/task';

const map: Record<TaskPriority, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  LOW: { label: 'Low', variant: 'success' },
  MEDIUM: { label: 'Medium', variant: 'warning' },
  HIGH: { label: 'High', variant: 'destructive' },
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, variant } = map[priority];
  return <Badge variant={variant}>{label}</Badge>;
}
