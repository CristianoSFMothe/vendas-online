import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entities';
import { LoginDto } from './dtos/login.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dtos/loginPayload.dto';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';
import { ReturnLogin } from './dtos/returnLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLogin> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await compare(loginDto.password, user?.password || '');

    if (!user || !isMatch) {
      throw new NotFoundException(
        'E-mail ou senha inválidos. Por favor tente novamente mais tarde.',
      );
    }

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
      user: new ReturnUserDto(user),
    };
  }
}
