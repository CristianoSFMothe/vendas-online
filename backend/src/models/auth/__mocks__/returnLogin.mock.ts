import { userEntityMock } from '../../../models/user/__mocks__/user.mock';
import { ReturnUserDto } from '../../../models/user/dtos/returnUser.dto';
import { ReturnLogin } from '../dtos/returnLogin.dto';
import { jwtMock } from './jwt.mock';

const returnUserDtoMock = new ReturnUserDto(userEntityMock);

export const returnLoginMock: ReturnLogin = {
  user: returnUserDtoMock,
  accessToken: jwtMock,
};
