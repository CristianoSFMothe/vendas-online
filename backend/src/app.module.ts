import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './models/user/user.module';
import { CityModule } from './models/city/city.module';
import { StateModule } from './models/state/state.module';
import { AddressModule } from './models/address/address.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './models/auth/auth.module';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CityModule,
    StateModule,
    AddressModule,
    CacheModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
