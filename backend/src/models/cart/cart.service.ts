import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDto } from './dto/insertCart.dto';
import { CartProductService } from '../cart-product/cart-product.service';
import { UpdateCartDto } from './dto/updateCart.dto';
import { ProductService } from '../product/product.service';

const LINE_AFFECTED = 1;

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    private readonly cartProductService: CartProductService,

    private readonly productService: ProductService,
  ) {}

  async findCartByUserId(
    userId: number,
    isRelations?: boolean,
  ): Promise<CartEntity> {
    const relations = isRelations
      ? { cartProduct: { product: true } }
      : undefined;
    const cart = await this.cartRepository.findOne({
      where: {
        userId,
        active: true,
      },
      relations,
    });

    if (!cart) {
      throw new NotFoundException('Nenhum carrinho ativo encontrado');
    }
    return cart;
  }

  async createCart(userId: number): Promise<CartEntity> {
    return this.cartRepository.save({
      active: true,
      userId,
    });
  }

  async insertProductInCart(
    insertCartDto: InsertCartDto,
    userId: number,
  ): Promise<CartEntity> {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.createCart(userId);
    });

    const product = await this.productService.findProductById(
      insertCartDto.productId,
    );

    if (product.amount < insertCartDto.amount) {
      throw new BadRequestException(
        'Quantidade solicitada maior do que a disponível',
      );
    }

    product.amount -= insertCartDto.amount;

    await this.productService.updateProductAmount(product.id, product.amount);

    await this.cartProductService.insertProductInCart(insertCartDto, cart);

    return cart;
  }

  async clearCart(userId: number): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId);

    await this.cartRepository.save({
      ...cart,
      active: false,
    });

    return {
      raw: [],
      affected: LINE_AFFECTED,
    };
  }

  async deleteProductCart(
    productId: number,
    userId: number,
  ): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(userId);

    return this.cartProductService.deleteProductCart(productId, cart.id);
  }

  async updateProductInCart(
    updateCartDto: UpdateCartDto,
    userId: number,
  ): Promise<CartEntity> {
    const cart = await this.findCartByUserId(userId).catch(async () => {
      return this.createCart(userId);
    });

    await this.cartProductService.updateProductInCart(updateCartDto, cart);

    return cart;
  }
}
