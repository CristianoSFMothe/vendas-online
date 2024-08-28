import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { ReturnUserDto } from '../dto/returnUser.dto';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import { UpdateUserMock } from '../__mocks__/updateUser.mock';
import {
  UpdatePasswordInvalidMock,
  UpdatePasswordMock,
} from '../__mocks__/updateUserPassword.mock';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest
              .fn()
              .mockResolvedValue(new ReturnUserDto(userEntityMock)),
            getAllUser: jest.fn().mockResolvedValue([userEntityMock]),
            getUserByIdUsingRelations: jest
              .fn()
              .mockResolvedValue(userEntityMock),
            findUserById: jest.fn().mockResolvedValue(userEntityMock),
            updateUser: jest
              .fn()
              .mockResolvedValue(new ReturnUserDto(userEntityMock)),
            deleteUserById: jest.fn().mockResolvedValue(undefined),
            updatePasswordUser: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = await userController.createUser(createUserMock);
      expect(result).toEqual(new ReturnUserDto(userEntityMock));
      expect(userService.createUser).toHaveBeenCalledWith(createUserMock);
    });
  });

  describe('getAllUser', () => {
    it('should return all users', async () => {
      const result = await userController.getAllUser();
      expect(result).toEqual([new ReturnUserDto(userEntityMock)]);
      expect(userService.getAllUser).toHaveBeenCalled();
    });
  });

  describe('getUserByIdUsingRelations', () => {
    it('should return a user by ID', async () => {
      const result = await userController.getUserById(userEntityMock.id);
      expect(result).toEqual(new ReturnUserDto(userEntityMock));
      expect(userService.getUserByIdUsingRelations).toHaveBeenCalledWith(
        userEntityMock.id,
      );
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID', async () => {
      // Mock do serviço para retornar um usuário
      jest
        .spyOn(userService, 'findUserById')
        .mockResolvedValueOnce(userEntityMock);

      const result = await userController.findUserById(userEntityMock.id);

      const expected = new ReturnUserDto(userEntityMock);

      expect(result.id).toBe(expected.id);
      expect(result.name).toBe(expected.name);
      expect(result.surname).toBe(expected.surname);
      expect(result.cpf).toBe(expected.cpf);
      expect(result.gender).toBe(expected.gender);
      expect(result.dateOfBirth).toBe(expected.dateOfBirth);
      expect(result.email).toBe(expected.email);
      expect(result.phone).toBe(expected.phone);
      expect(result.age).toBe(expected.age);

      expect(userService.findUserById).toHaveBeenCalledWith(userEntityMock.id);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const result = await userController.updateUser(
        userEntityMock.id,
        UpdateUserMock as any,
      );
      expect(result).toEqual(new ReturnUserDto(userEntityMock));
      expect(userService.updateUser).toHaveBeenCalledWith(
        userEntityMock.id,
        UpdateUserMock,
      );
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user', async () => {
      await userController.deleteUser(userEntityMock.id);
      expect(userService.deleteUserById).toHaveBeenCalledWith(
        userEntityMock.id,
      );
    });
  });

  describe('updatePasswordUser', () => {
    it('should update the user password successfully', async () => {
      jest
        .spyOn(userService, 'updatePasswordUser')
        .mockResolvedValueOnce(userEntityMock);

      const result = await userController.updatePasswordUser(
        UpdatePasswordMock,
        userEntityMock.id,
      );

      expect(result).toEqual(userEntityMock);
      expect(userService.updatePasswordUser).toHaveBeenCalledWith(
        UpdatePasswordMock,
        userEntityMock.id,
      );
    });

    it('should throw an error if user does not exist', async () => {
      jest
        .spyOn(userService, 'updatePasswordUser')
        .mockRejectedValueOnce(
          new HttpException('User not found', HttpStatus.NOT_FOUND),
        );

      await expect(
        userController.updatePasswordUser(
          UpdatePasswordMock,
          userEntityMock.id,
        ),
      ).rejects.toThrowError();

      expect(userService.updatePasswordUser).toHaveBeenCalledWith(
        UpdatePasswordMock,
        userEntityMock.id,
      );
    });

    it('should throw an error if the last password is incorrect', async () => {
      jest
        .spyOn(userService, 'updatePasswordUser')
        .mockRejectedValueOnce(
          new HttpException('Invalid password update', HttpStatus.BAD_REQUEST),
        );

      await expect(
        userController.updatePasswordUser(
          UpdatePasswordInvalidMock,
          userEntityMock.id,
        ),
      ).rejects.toThrowError();

      expect(userService.updatePasswordUser).toHaveBeenCalledWith(
        UpdatePasswordInvalidMock,
        userEntityMock.id,
      );
    });
  });
});
