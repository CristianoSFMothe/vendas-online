import { AddressEntity } from '../entities/address.entity';

export class ReturnAddressDto {
  complement: string;
  street: string;
  neighborhood: string;
  numberAddress: number;
  cep: string;

  constructor(address: AddressEntity) {
    this.complement = address.complement;
    this.street = address.street;
    this.neighborhood = address.neighborhood;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;
  }
}
