import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReturnUserDto } from '../dtos/returnUser.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { createUserMock } from '../__mocks__/createUser.mock';
import { userEntityMock } from '../__mocks__/user.mock';
import { updateUserMock } from '../__mocks__/updateUser.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(service, 'findUserByEmail').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userEntityMock);

      const result = await service.createUser(createUserMock);
      const returnUserDtoMock = new ReturnUserDto(userEntityMock);

      expect(result).toEqual(returnUserDtoMock);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...createUserMock,
        cpf: expect.any(String),
        typeUser: 1,
        password: expect.any(String),
        age: expect.any(Number),
      });
    });

    it('should throw BadRequestException for invalid CPF', async () => {
      const invalidCpfMock = {
        ...createUserMock,
        cpf: '111.222.333-44',
      };

      jest.spyOn(service, 'findUserByEmail').mockResolvedValueOnce(undefined);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.createUser(invalidCpfMock)).rejects.toThrow(
        new BadRequestException('CPF inválido.'),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      jest
        .spyOn(service, 'findUserByEmail')
        .mockResolvedValueOnce(userEntityMock);

      await expect(service.createUser(createUserMock)).rejects.toThrow(
        new ConflictException('Email já cadastrado.'),
      );
    });

    it('should throw ConflictException if CPF already exists', async () => {
      jest.spyOn(service, 'findUserByEmail').mockResolvedValueOnce(undefined);
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userEntityMock);

      await expect(service.createUser(createUserMock)).rejects.toThrow(
        new ConflictException('CPF já cadastrado.'),
      );
    });
  });

  describe('findUserByEmail', () => {
    it('should return a user by email', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userEntityMock);

      const result = await service.findUserByEmail(userEntityMock.email);

      expect(result).toEqual(userEntityMock);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        service.findUserByEmail(userEntityMock.email),
      ).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
    });

    it('should throw an error if database fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(
        service.findUserByEmail(userEntityMock.email),
      ).rejects.toThrow();
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userEntityMock);

      const result = await service.findUserById(userEntityMock.id);

      expect(result).toEqual(userEntityMock);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.findUserById(userEntityMock.id)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado ou não existe.'),
      );
    });

    it('should throw an error if database fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
    });
  });

  describe('getUserByIdUsingRelations', () => {
    it('should return user with relations by ID', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userEntityMock);

      const result = await service.getUserByIdUsingRelations(userEntityMock.id);

      expect(result).toEqual(userEntityMock);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(
        service.getUserByIdUsingRelations(userEntityMock.id),
      ).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
    });

    it('should throw an error if database fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(
        service.getUserByIdUsingRelations(userEntityMock.id),
      ).rejects.toThrow();
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValueOnce(userEntityMock);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        ...userEntityMock,
        ...updateUserMock,
      });

      const result = await service.updateUser(
        userEntityMock.id,
        updateUserMock as any,
      );

      expect(result).toEqual({
        ...userEntityMock,
        ...updateUserMock,
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userEntityMock,
        ...updateUserMock,
      });
    });

    it('should throw NotFoundException if user to update not found', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValueOnce(undefined);

      await expect(
        service.updateUser(userEntityMock.id, updateUserMock as any),
      ).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
    });

    it('should throw an error if database fails', async () => {
      jest.spyOn(service, 'findUserById').mockRejectedValueOnce(new Error());

      await expect(
        service.updateUser(userEntityMock.id, updateUserMock as any),
      ).rejects.toThrow();
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userEntityMock);
      jest.spyOn(userRepository, 'remove').mockResolvedValueOnce(undefined);

      await service.deleteUserById(userEntityMock.id);

      expect(userRepository.remove).toHaveBeenCalledWith(userEntityMock);
    });

    it('should throw NotFoundException if user to delete not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(service.deleteUserById(userEntityMock.id)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado.'),
      );
    });

    it('should throw an error if database fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

      await expect(service.deleteUserById(userEntityMock.id)).rejects.toThrow();
    });
  });
});
