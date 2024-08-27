import { ReturnUserDto } from '../../../models/user/dto/returnUser.dto';

export interface ReturnLogin {
  user: ReturnUserDto;
  accessToken: string;
}
