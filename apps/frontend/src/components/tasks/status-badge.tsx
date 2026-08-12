import { Badge } from '@/components/ui/badge';
import type { TaskStatus } from '@/types/task';

const map: Record<TaskStatus, { label: string; variant: 'default' | 'primary' | 'success' }> = {
  TODO: { label: 'To Do', variant: 'default' },
  IN_PROGRESS: { label: 'In Progress', variant: 'primary' },
  DONE: { label: 'Done', variant: 'success' },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
