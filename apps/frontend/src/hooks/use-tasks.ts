'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import type { Task, TaskListResponse, TaskQuery, TaskStats } from '@/types/task';

const TASKS_KEY = 'tasks';
const STATS_KEY = 'task-stats';

export function useTasks(query: TaskQuery) {
  return useQuery({
    queryKey: [TASKS_KEY, query],
    queryFn: async () => {
      const { data } = await api.get<TaskListResponse>('/tasks', { params: query });
      return data;
    },
    placeholderData: (prev) => prev,
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: [STATS_KEY],
    queryFn: async () => {
      const { data } = await api.get<TaskStats>('/tasks/stats');
      return data;
    },
  });
}

interface TaskPayload {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: string;
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TaskPayload) => {
      const { data } = await api.post<Task>('/tasks', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Task created');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Failed to create task'),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: TaskPayload & { id: string }) => {
      const { data } = await api.patch<Task>(`/tasks/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Task updated');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Failed to update task'),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
      toast.success('Task deleted');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Failed to delete task'),
  });
}
