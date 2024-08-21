import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { CartService } from './cart.service';
import { InsertCartDto } from './dtos/insertCart.dto';
import { CartEntity } from './entities/cart.entity';
import { UserId } from 'src/decorators/user-id.decorator';

@Roles(UserType.USER)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserType.ADMIN, UserType.USER)
  @Post()
  async createCart(
    @Body() insertCartDto: InsertCartDto,
    @UserId() userId: number,
  ): Promise<CartEntity> {
    return this.cartService.insertProductInCart(insertCartDto, userId);
  }
}
