import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ReturnsUserDto as ReturnUserDto } from '../user/dtos/returnUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto): Promise<ReturnUserDto> {
    return new ReturnUserDto(await this.authService.login(loginDto));
  }
}
