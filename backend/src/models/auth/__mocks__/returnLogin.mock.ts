import { userEntityMock } from '../../../models/user/__mocks__/user.mock';
import { ReturnUserDto } from '../../../models/user/dto/returnUser.dto';
import { ReturnLogin } from '../dto/returnLogin.dto';
import { jwtMock } from './jwt.mock';

const returnUserDtoMock = new ReturnUserDto(userEntityMock);

export const returnLoginMock: ReturnLogin = {
  user: returnUserDtoMock,
  accessToken: jwtMock,
};
