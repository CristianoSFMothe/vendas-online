import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { ReturnUserDto } from '../dtos/returnUser.dto';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import { updateUserMock } from '../__mocks__/updateUser.mock';

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

  it('should create a user', async () => {
    const result = await userController.createUser(createUserMock);
    expect(result).toEqual(new ReturnUserDto(userEntityMock));
    expect(userService.createUser).toHaveBeenCalledWith(createUserMock);
  });

  it('should return all users', async () => {
    const result = await userController.getAllUser();
    expect(result).toEqual([new ReturnUserDto(userEntityMock)]);
    expect(userService.getAllUser).toHaveBeenCalled();
  });

  it('should return a user by ID', async () => {
    const result = await userController.getUserById(userEntityMock.id);
    expect(result).toEqual(new ReturnUserDto(userEntityMock));
    expect(userService.getUserByIdUsingRelations).toHaveBeenCalledWith(
      userEntityMock.id,
    );
  });

  it('should find a user by ID', async () => {
    // Mock do serviço para retornar um usuário
    jest
      .spyOn(userService, 'findUserById')
      .mockResolvedValueOnce(userEntityMock);

    // Executa o método do controlador
    const result = await userController.findUserById(userEntityMock.id);

    // Cria um DTO esperado a partir do mock
    const expected = new ReturnUserDto(userEntityMock);

    // Comparando campos individualmente
    expect(result.id).toBe(expected.id);
    expect(result.name).toBe(expected.name);
    expect(result.surname).toBe(expected.surname);
    expect(result.cpf).toBe(expected.cpf);
    expect(result.gender).toBe(expected.gender);
    expect(result.dateOfBirth).toBe(expected.dateOfBirth);
    expect(result.email).toBe(expected.email);
    expect(result.phone).toBe(expected.phone);
    expect(result.age).toBe(expected.age);
    // Verifica se o método do serviço foi chamado com o ID correto
    expect(userService.findUserById).toHaveBeenCalledWith(userEntityMock.id);
  });

  it('should update a user', async () => {
    const result = await userController.updateUser(
      userEntityMock.id,
      updateUserMock as any,
    );
    expect(result).toEqual(new ReturnUserDto(userEntityMock));
    expect(userService.updateUser).toHaveBeenCalledWith(
      userEntityMock.id,
      updateUserMock,
    );
  });

  it('should delete a user', async () => {
    await userController.deleteUser(userEntityMock.id);
    expect(userService.deleteUserById).toHaveBeenCalledWith(userEntityMock.id);
  });
});
