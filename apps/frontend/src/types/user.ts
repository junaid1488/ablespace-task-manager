export type Role = 'USER' | 'GUEST';

export interface User {
  id: string;
  email: string | null;
  name: string;
  role: Role;
  isGuest: boolean;
  theme: 'light' | 'dark';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
