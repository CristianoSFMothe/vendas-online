import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartProductModule } from '../cart-product/cart-product.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity]),
    CartProductModule,
    ProductModule,
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
