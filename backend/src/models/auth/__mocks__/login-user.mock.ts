import { userEntityMock } from '../../../models/user/__mocks__/user.mock';
import { LoginDto } from '../dto/login.dto';

export const loginUserMock: LoginDto = {
  email: userEntityMock.email,
  password: 'abc',
};
