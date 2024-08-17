import { SetMetadata } from '@nestjs/common';
import { UserType } from '../enum/userType.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
