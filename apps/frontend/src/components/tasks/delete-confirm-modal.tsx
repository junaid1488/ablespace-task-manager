'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '@/hooks/use-tasks';
import type { Task } from '@/types/task';

interface DeleteConfirmModalProps {
  task: Task | null;
  onClose: () => void;
}

export function DeleteConfirmModal({ task, onClose }: DeleteConfirmModalProps) {
  const deleteTask = useDeleteTask();

  return (
    <Modal
      open={!!task}
      onClose={onClose}
      title="Delete task"
      description={`Are you sure you want to delete "${task?.title}"? This can't be undone.`}
    >
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          isLoading={deleteTask.isPending}
          onClick={() => task && deleteTask.mutate(task.id, { onSuccess: onClose })}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
