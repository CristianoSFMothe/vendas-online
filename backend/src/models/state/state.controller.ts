import { Controller, Get, Param } from '@nestjs/common';
import { StateService } from './state.service';
import { StateEntity } from './entities/state.entity';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';

@Roles(UserType.ADMIN)
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  async getAllState(): Promise<StateEntity[]> {
    return this.stateService.getAllState();
  }

  @Get(':id')
  async getStateById(@Param('id') id: number): Promise<StateEntity> {
    return this.stateService.getStateById(id);
  }
}
