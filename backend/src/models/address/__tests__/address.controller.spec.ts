import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { addressMock } from '../__mocks__/address.mock';
import { createAddressDtoMock } from '../__mocks__/createAddress.mock';
import { updateAddressDtoMock } from '../__mocks__/updateAddress.mock';
import { ReturnAddressDto } from '../dtos/returnAddress.dto';

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(addressMock),
            updateAddress: jest.fn().mockResolvedValue(addressMock),
            deleteAddress: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  describe('createAddress', () => {
    it('should create and return an address', async () => {
      const result = await controller.createAddress(createAddressDtoMock, 1);
      expect(result).toEqual(addressMock);
      expect(service.createAddress).toHaveBeenCalledWith(
        createAddressDtoMock,
        1,
      );
    });
  });

  describe('updateAddress', () => {
    it('should update and return an address', async () => {
      const result = await controller.updateAddress(1, updateAddressDtoMock, 1);
      expect(result).toEqual(new ReturnAddressDto(addressMock));
      expect(service.updateAddress).toHaveBeenCalledWith(
        1,
        updateAddressDtoMock,
        1,
      );
    });
  });

  describe('deleteAddress', () => {
    it('should delete an address', async () => {
      await controller.deleteAddress(1, 1);
      expect(service.deleteAddress).toHaveBeenCalledWith(1, 1);
    });
  });
});
