import { User } from '../../users/entities/user.entity';

export interface RequestWithUser extends Request {
  user: User & {
    sub: string;
    tenantId: string;
    roles: string[];
  };
  params: {
    id?: string;
    [key: string]: string | undefined;
  };
}
