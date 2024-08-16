import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StateEntity } from './entities/state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(StateEntity)
    private readonly stateRepository: Repository<StateEntity>,
  ) {}

  async getAllState(): Promise<StateEntity[]> {
    return this.stateRepository.find();
  }

  async getStateById(id: number): Promise<StateEntity> {
    const state = await this.stateRepository.findOneBy({ id });
    if (!state) {
      throw new NotFoundException('Estado não encontrado.');
    }
    return state;
  }
}
