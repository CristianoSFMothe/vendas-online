import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { cartMock } from '../__mocks__ /cart.mock';
import { returnDeleteMock } from '../../../__mocks__/returnDelete.mock';
import { InsertCartDto } from '../dto/insertCart.dto';
import { ReturnCartDto } from '../dto/returnCart.dto';
import { UpdateCartDto } from '../dto/updateCart.dto';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartMock),
            findCartByUserId: jest.fn().mockResolvedValue(cartMock),
            clearCart: jest.fn().mockResolvedValue(returnDeleteMock),
            deleteProductCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(cartMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(cartService).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a cart and return it', async () => {
      const insertCartDto: InsertCartDto = { productId: 1, amount: 2 };
      const userId = 1;

      const result = await controller.createCart(insertCartDto, userId);

      expect(result).toEqual(new ReturnCartDto(cartMock));
      expect(cartService.insertProductInCart).toHaveBeenCalledWith(
        insertCartDto,
        userId,
      );
    });
  });

  describe('findCartByUserId', () => {
    it('should return the cart of the user', async () => {
      const userId = 1;

      const result = await controller.findCartByUserId(userId);

      expect(result).toEqual(new ReturnCartDto(cartMock));
      expect(cartService.findCartByUserId).toHaveBeenCalledWith(userId, true);
    });
  });

  describe('clearCart', () => {
    it('should clear the cart and return DeleteResult', async () => {
      const userId = 1;

      const result = await controller.clearCart(userId);

      expect(result).toEqual(returnDeleteMock);
      expect(cartService.clearCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('deleteProductCart', () => {
    it('should delete a product from the cart and return DeleteResult', async () => {
      const userId = 1;
      const productId = 1;

      const result = await controller.deleteProductCart(productId, userId);

      expect(result).toEqual(returnDeleteMock);
      expect(cartService.deleteProductCart).toHaveBeenCalledWith(
        productId,
        userId,
      );
    });
  });

  describe('updateProductInCart', () => {
    it('should update a product in the cart and return the updated cart', async () => {
      const updateCartDto: UpdateCartDto = { productId: 1, amount: 5 };
      const userId = 1;

      const result = await controller.updateProductInCart(
        updateCartDto,
        userId,
      );

      expect(result).toEqual(new ReturnCartDto(cartMock));
      expect(cartService.updateProductInCart).toHaveBeenCalledWith(
        updateCartDto,
        userId,
      );
    });
  });
});
