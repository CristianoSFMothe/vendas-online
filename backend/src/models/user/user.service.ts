import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entities';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { hash } from 'bcrypt';
import { isValidCpf } from './utils/isValidCpf.utils';
import { formatCpf } from './utils/formatting.utils';
import { calculateAge } from './utils/age.utils';
import { ReturnUserDto } from './dtos/returnUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    // Validação de CPF
    if (!isValidCpf(createUserDto.cpf)) {
      throw new BadRequestException('CPF inválido.');
    }

    // Verificar se o email já está cadastrado
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email já cadastrado.');
    }

    // Verificar se o CPF já está cadastrado
    const existingUserByCpf = await this.userRepository.findOne({
      where: { cpf: createUserDto.cpf },
    });

    if (existingUserByCpf) {
      throw new ConflictException('CPF já cadastrado.');
    }

    // Se as validações passarem, prosseguir com o hash da senha e salvar o usuário
    const saltOrRounds = 10;
    const passwordHashed = await hash(createUserDto.password, saltOrRounds);

    const age = calculateAge(createUserDto.dateOfBirth);

    // Formatação dos valores
    const formattedCpf = formatCpf(createUserDto.cpf);

    // Salva o usuário no banco de dados
    const user = await this.userRepository.save({
      ...createUserDto,
      cpf: formattedCpf,
      typeUser: 1,
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
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário ou senha inválidos.');
    }

    return user;
  }
}
