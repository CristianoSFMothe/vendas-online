import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { Repository } from 'typeorm';
import { AddressEntity } from '../entities/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { addressMock } from '../__mocks__/address.mock';
import { UserService } from '../../../models/user/user.service';
import { CityService } from '../../../models/city/city.service';
import { createAddressDtoMock } from '../__mocks__/createAddress.mock';
import { updateAddressDtoMock } from '../__mocks__/updateAddress.mock';
import { userEntityMock } from '../../../models/user/__mocks__/user.mock';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(addressMock),
            findOneBy: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue([addressMock]),
            update: jest.fn().mockResolvedValue(addressMock),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue({ id: 3640 }),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
  });

  describe('createAddress', () => {
    it('should create and return an address', async () => {
      const result = await service.createAddress(createAddressDtoMock, 1);
      expect(result).toEqual(addressMock);
      expect(addressRepository.save).toHaveBeenCalledWith({
        ...createAddressDtoMock,
        userId: 1,
      });
    });
  });

  describe('getAllAddress', () => {
    it('should return all addresses to user', async () => {
      const addresses = await service.findAllAddressByUserId(userEntityMock.id);

      expect(addresses).toEqual([addressMock]);
    });

    it('should return not found if not address registred', async () => {
      jest.spyOn(addressRepository, 'find').mockReturnValue(undefined);

      expect(
        service.findAllAddressByUserId(userEntityMock.id),
      ).rejects.toThrowError();
    });
  });

  describe('updateAddress', () => {
    it('should update and return an address', async () => {
      const updatedAddress = { ...addressMock, ...updateAddressDtoMock };
      addressRepository.findOneBy = jest.fn().mockResolvedValue(addressMock);
      const result = await service.updateAddress(1, updateAddressDtoMock, 1);
      expect(result).toEqual(updatedAddress);
      expect(addressRepository.save).toHaveBeenCalledWith(updatedAddress);
    });

    it('should throw NotFoundException if address does not exist', async () => {
      addressRepository.findOneBy = jest.fn().mockResolvedValue(undefined);
      await expect(
        service.updateAddress(1, updateAddressDtoMock, 1),
      ).rejects.toThrowError('Endereço não encontrado.');
    });

    it('should throw NotFoundException if user does not own address', async () => {
      addressRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ ...addressMock, userId: 2 });
      await expect(
        service.updateAddress(1, updateAddressDtoMock, 1),
      ).rejects.toThrowError('O usuário não possui este endereço.');
    });
  });

  describe('deleteAddress', () => {
    it('should delete an address', async () => {
      await service.deleteAddress(1, 1);
      expect(addressRepository.remove).toHaveBeenCalledWith(addressMock);
    });

    it('should throw NotFoundException if address does not exist', async () => {
      addressRepository.findOneBy = jest.fn().mockResolvedValue(undefined);
      await expect(service.deleteAddress(1, 1)).rejects.toThrowError(
        'Endereço não encontrado.',
      );
    });

    it('should throw ForbiddenException if user does not own address', async () => {
      addressRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ ...addressMock, userId: 2 });
      await expect(service.deleteAddress(1, 1)).rejects.toThrowError(
        'O usuário não possui este endereço.',
      );
    });
  });
});
