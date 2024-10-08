import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entities';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { isValidCpf } from './utils/isValidCpf.utils';
import { formatCpf } from './utils/formatting.utils';
import { calculateAge } from './utils/age.utils';
import { ReturnUserDto } from './dto/returnUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserType } from '../../enum/userType.enum';
import { UpdatePasswordUser } from './dto/updatePassword.dto';
import {
  createPasswordHashed,
  validatePassword,
} from '../../utils/password.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    if (!isValidCpf(createUserDto.cpf)) {
      throw new BadRequestException('CPF inválido.');
    }

    const existingUserByEmail = await this.findUserByEmail(
      createUserDto.email,
    ).catch(() => undefined);

    if (existingUserByEmail) {
      throw new ConflictException('Email já cadastrado.');
    }

    const existingUserByCpf = await this.userRepository.findOne({
      where: { cpf: createUserDto.cpf },
    });

    if (existingUserByCpf) {
      throw new ConflictException('CPF já cadastrado.');
    }

    const passwordHashed = await createPasswordHashed(createUserDto.password);

    const age = calculateAge(createUserDto.dateOfBirth);

    const formattedCpf = formatCpf(createUserDto.cpf);

    const user = await this.userRepository.save({
      ...createUserDto,
      cpf: formattedCpf,
      typeUser: UserType.USER,
      password: passwordHashed,
      age,
    });

    return new ReturnUserDto(user);
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou não existe.');
    }

    return user;
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updatedUser = Object.assign(user, updateUserDto);

    return this.userRepository.save(updatedUser);
  }

  async deleteUserById(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.userRepository.remove(user);
  }

  async updatePasswordUser(
    updatePasswordUser: UpdatePasswordUser,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    const passwordHashed = await createPasswordHashed(
      updatePasswordUser.newPassword,
    );

    const isMatch = await validatePassword(
      updatePasswordUser.lastPassword,
      user.password || '',
    );

    if (!isMatch) {
      throw new BadRequestException('Senha inválida');
    }

    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
