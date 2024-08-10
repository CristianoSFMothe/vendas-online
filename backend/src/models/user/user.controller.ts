import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.createUser(createUser);
  }

  @Get()
  async getAllUser(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDto(userEntity),
    );
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return new ReturnUserDto(user);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUserById(id);
  }
}
