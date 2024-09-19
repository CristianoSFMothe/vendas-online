import { UserEntity } from '../entities/user.entities';
import { GenderType } from '../enum/user.enum';

export const UpdateUserMock: Partial<UserEntity> = {
  name: 'UpdatedName',
  surname: 'UpdatedSurname',
  cpf: '47810814010',
  gender: GenderType.FEMALE,
  dateOfBirth: '01/01/1990',
  email: 'updatedemail@emali.com',
  phone: '321532523533',
};
