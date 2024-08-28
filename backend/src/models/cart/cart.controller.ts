import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';
import { CartService } from './cart.service';
import { InsertCartDto } from './dto/insertCart.dto';
import { UserId } from '../../decorators/user-id.decorator';
import { ReturnCartDto } from './dto/returnCart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCartDto } from './dto/updateCart.dto';

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

  @Roles(UserType.USER)
  @Get()
  async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.findCartByUserId(userId, true),
    );
  }

  @Roles(UserType.USER)
  @Delete()
  async clearCart(@UserId() userId: number): Promise<DeleteResult> {
    return this.cartService.clearCart(userId);
  }

  @Roles(UserType.USER)
  @Delete('/product/:productId')
  async deleteProductCart(
    @Param('productId') productId: number,
    @UserId() userId: number,
  ): Promise<DeleteResult> {
    return this.cartService.deleteProductCart(productId, userId);
  }

  @Roles(UserType.USER)
  @Patch()
  async updateProductInCart(
    @Body() updateCartDto: UpdateCartDto,
    @UserId() userId: number,
  ): Promise<ReturnCartDto> {
    return new ReturnCartDto(
      await this.cartService.updateProductInCart(updateCartDto, userId),
    );
  }
}
