import { Controller, Get, Param } from '@nestjs/common';
import { StateService } from './state.service';
import { StateEntity } from './entities/state.entity';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';

@Roles(UserType.ADMIN)
@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Roles(UserType.ADMIN, UserType.USER)
  @Get()
  async getAllState(): Promise<StateEntity[]> {
    return this.stateService.getAllState();
  }

  @Roles(UserType.ADMIN, UserType.USER)
  @Get(':id')
  async getStateById(@Param('id') id: number): Promise<StateEntity> {
    return this.stateService.getStateById(id);
  }
}
