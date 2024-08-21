import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { CartService } from './cart.service';
import { InsertCartDto } from './dtos/insertCart.dto';
import { UserId } from '../../decorators/user-id.decorator';
import { ReturnCartDto } from './dtos/returnCart.dto';

@Roles(UserType.USER)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserType.ADMIN, UserType.USER)
  @Post()
  async createCart(
    @Body() insertCartDto: InsertCartDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.insertProductInCart(insertCartDto, userId),
    );
  }
}
