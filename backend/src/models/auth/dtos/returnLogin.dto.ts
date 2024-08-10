import { ReturnUserDto } from '../../../models/user/dtos/returnUser.dto';

export interface ReturnLogin {
  user: ReturnUserDto;
  accessToken: string;
}
