import { UserType } from '../../../enum/userTyper.enum';
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
  password: '$2b$10$S62WmVpIxL52Z.0y22DWfuaAz8.XUNESChWP.AlMFZnOJ9n9uiqi.',
  phone: '321532523532',
  typeUser: UserType.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};
