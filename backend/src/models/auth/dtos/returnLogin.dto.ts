import { ReturnUserDto } from 'src/models/user/dtos/returnUser.dto';

export interface ReturnLogin {
  user: ReturnUserDto;
  accessToken: string;
}
