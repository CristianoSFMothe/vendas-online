import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ReturnLogin } from './dto/returnLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() loginDto: LoginDto): Promise<ReturnLogin> {
    return this.authService.login(loginDto);
  }
}
