import { UserType } from '../../../models/enum/userTyper.enum';
import { UserEntity } from '../entities/user.entities';
import { GenderType } from '../enum/user.enum';

export const userEntityMock: UserEntity = {
  id: 43242,
  name: 'nameMock',
  surname: 'surnameMock',
  cpf: '123543543',
  gender: GenderType.MALE,
  dateOfBirth: '01/01/2000',
  age: 24,
  email: 'emailmock@emali.com',
  password: 'largePassword',
  phone: '321532523532',
  typeUser: UserType.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};
