import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './models/user/user.module';
import { CityModule } from './models/city/city.module';
import { StateModule } from './models/state/state.module';
import { AddressModule } from './models/address/address.module';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './models/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './models/product/product.module';
import { CategoryModule } from './models/category/category.module';
import { CartModule } from './models/cart/cart.module';
import { CartProductModule } from './models/cart-product/cart-product.module';
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CityModule,
    StateModule,
    AddressModule,
    CacheModule,
    AuthModule,
    JwtModule,
    CategoryModule,
    ProductModule,
    CartModule,
    CartProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
