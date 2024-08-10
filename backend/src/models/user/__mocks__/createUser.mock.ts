import { GenderType } from '../enum/user.enum';
import { CreateUserDto } from '../dtos/createUser.dto';

export const createUserMock: CreateUserDto = {
  name: 'nameMock',
  surname: 'surnameMock',
  cpf: '59274625022',
  gender: GenderType.MALE,
  dateOfBirth: '01/01/2000',
  email: 'emailmock@emali.com',
  password: 'largePassword',
  phone: '321532523532',
};
