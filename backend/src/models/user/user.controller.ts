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
import { CreateUserDto } from './dto/createUser.dto';
import { ReturnUserDto } from './dto/returnUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { UpdatePasswordUser } from './dto/updatePassword.dto';
import { UserEntity } from './entities/user.entities';
import { UserId } from '../../decorators/user-id.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.createUser(createUser);
  }

  @Roles(UserType.ADMIN)
  @Get()
  async getAllUser(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUser()).map(
      (userEntity) => new ReturnUserDto(userEntity),
    );
  }

  @Roles(UserType.ADMIN)
  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Get(':id')
  async findUserById(@Param('id') id: number): Promise<ReturnUserDto> {
    return this.userService.findUserById(id);
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Patch('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return new ReturnUserDto(user);
  }

  @Roles(UserType.ADMIN)
  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    await this.userService.deleteUserById(id);
  }

  @Roles(UserType.USER, UserType.ADMIN)
  @Patch()
  async updatePasswordUser(
    @Body() updatePasswordUser: UpdatePasswordUser,
    @UserId() userId: number,
  ): Promise<UserEntity> {
    return this.userService.updatePasswordUser(updatePasswordUser, userId);
  }
}
