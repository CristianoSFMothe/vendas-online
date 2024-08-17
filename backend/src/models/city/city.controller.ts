import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { CityEntity } from './entities/city.entity';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';

@Roles(UserType.ADMIN)
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Roles(UserType.ADMIN, UserType.USER)
  @Get('/:stateId')
  async getAllCitiesByStateId(
    @Param('stateId') stateId: number,
  ): Promise<CityEntity[]> {
    return this.cityService.getAllCitiesByStateId(stateId);
  }
}
