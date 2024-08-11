import { ReturnCityDto } from '../../../models/city/dtos/returnCity.dto';
import { AddressEntity } from '../entities/address.entity';

export class ReturnAddressDto {
  complement: string;
  street: string;
  neighborhood: string;
  numberAddress: number;
  cep: string;
  city?: ReturnCityDto;

  constructor(address: AddressEntity) {
    this.complement = address.complement;
    this.street = address.street;
    this.neighborhood = address.neighborhood;
    this.numberAddress = address.numberAddress;
    this.cep = address.cep;

    this.city = address.city ? new ReturnCityDto(address.city) : undefined;
  }
}
