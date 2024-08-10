import {
  Body,
  Controller,
  Delete,
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
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from '../enum/userTyper.enum';

@Roles(UserType.USER)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/:userId')
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @Param('userId') userId: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, userId);
  }

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

  @Delete('/:id')
  async deleteAddress(
    @Param('id') id: number,
    @Query('userId') userId: number,
  ): Promise<void> {
    await this.addressService.deleteAddress(id, userId);
  }
}
