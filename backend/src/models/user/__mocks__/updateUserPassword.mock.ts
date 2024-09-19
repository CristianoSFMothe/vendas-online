import { UpdatePasswordUser } from '../dto/updatePassword.dto';

export const UpdatePasswordMock: UpdatePasswordUser = {
  lastPassword: 'Abc@123',
  newPassword: 'def456',
};

export const UpdatePasswordInvalidMock: UpdatePasswordUser = {
  lastPassword: 'Abc@1234',
  newPassword: 'asfasfa',
};
