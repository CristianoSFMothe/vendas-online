import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entities';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Get()
  async getAllUser(): Promise<UserEntity[]> {
    return this.userService.getAlUser();
  }
}
