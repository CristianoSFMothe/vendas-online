import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';
import { UpdateAddressDto } from './dtos/updateAddress.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(userId);

    await this.cityService.findCityById(createAddressDto.cityId);

    return this.addressRepository.save({
      ...createAddressDto,
      userId,
    });
  }

  async findAllAddressByUserId(userId: number): Promise<AddressEntity[]> {
    const address = await this.addressRepository.find({
      where: {
        userId,
      },
      relations: {
        city: {
          state: true,
        },
      },
    });

    if (!address || address.length === 0) {
      throw new NotFoundException('Nenhum endereço não encontrado.');
    }

    return address;
  }

  async updateAddress(
    id: number,
    updateAddressDto: UpdateAddressDto,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(userId); // Verificar se o usuário existe

    const address = await this.addressRepository.findOneBy({ id });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    if (address.userId !== userId) {
      throw new NotFoundException('O usuário não possui este endereço.');
    }

    const updatedAddress = Object.assign(address, updateAddressDto);

    return this.addressRepository.save(updatedAddress);
  }

  async deleteAddress(id: number, userId: number): Promise<void> {
    const address = await this.addressRepository.findOneBy({ id });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    if (address.userId !== userId) {
      throw new ForbiddenException('O usuário não possui este endereço.');
    }

    await this.addressRepository.remove(address);
  }
}
