import { ReturnAddressDto } from '../../../models/address/dtos/returnAddress.dto';
import { UserEntity } from '../entities/user.entities';
import { GenderType } from '../enum/user.enum';

export class ReturnUserDto {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  gender: GenderType;
  dateOfBirth: string;
  cpf: string;
  age: number;
  addresses?: ReturnAddressDto[];

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.email = user.email;
    this.phone = user.phone;
    this.gender = user.gender;
    this.dateOfBirth = user.dateOfBirth;
    this.cpf = user.cpf;
    this.age = user.age;

    this.addresses = user.addresses
      ? user.addresses.map((address) => new ReturnAddressDto(address))
      : undefined;
  }
}
