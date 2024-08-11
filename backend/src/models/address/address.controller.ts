import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { UpdateAddressDto } from './dtos/updateAddress.dto';
import { ReturnAddressDto } from './dtos/returnAddress.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../enum/userTyper.enum';
import { UserId } from '../../decorators/user-id.decorator';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Roles(UserType.USER)
  @Post('/:userId')
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, userId);
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Get()
  async findAllAddressByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDto[]> {
    return (await this.addressService.findAllAddressByUserId(userId)).map(
      (address) => new ReturnAddressDto(address),
    );
  }

  @Roles(UserType.USER)
  @Patch('/:id')
  async updateAddress(
    @Param('id') id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @Query('userId') userId: number,
  ): Promise<ReturnAddressDto> {
    const address = await this.addressService.updateAddress(
      id,
      updateAddressDto,
      userId,
    );
    return new ReturnAddressDto(address);
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Delete('/:id')
  async deleteAddress(
    @Param('id') id: number,
    @Query('userId') userId: number,
  ): Promise<void> {
    await this.addressService.deleteAddress(id, userId);
  }
}
