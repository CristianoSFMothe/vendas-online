import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './models/user/user.module';
import { CityModule } from './models/city/city.module';
import { StateModule } from './models/state/state.module';
import { AddressModule } from './models/address/address.module';
@Module({
  imports: [DatabaseModule, UserModule, CityModule, StateModule, AddressModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
