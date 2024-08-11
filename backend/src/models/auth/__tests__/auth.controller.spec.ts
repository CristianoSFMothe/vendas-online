import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { ReturnLogin } from '../dtos/returnLogin.dto';
import { LoginDto } from '../dtos/login.dto';
import { returnLoginMock } from '../__mocks__/returnLogin.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(returnLoginMock),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a login token and user info', async () => {
    const loginDto: LoginDto = {
      email: 'cristiano@email.com',
      password: 'abc',
    };

    const result: ReturnLogin = await controller.login(loginDto);
    expect(result).toEqual(returnLoginMock);
    expect(authService.login).toHaveBeenCalledWith(loginDto);
  });
});
