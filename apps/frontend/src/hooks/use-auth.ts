'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/auth-store';
import type { AuthResponse } from '@/types/user';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  name: string;
}

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast.success(`Welcome back, ${data.user.name}`);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Login failed');
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/register', payload);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast.success('Account created successfully');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Registration failed');
    },
  });
}

export function useGuestLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<AuthResponse>('/auth/guest');
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast.success('Continuing as guest');
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Could not start guest session');
    },
  });
}
