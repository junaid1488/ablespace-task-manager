import { Role } from '../../common/enums/task.enums';

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  name: string;
  role: Role;
  isGuest: boolean;
}