import { Controller } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../enum/userType.enum';

@Roles(UserType.USER)
@Controller('cart')
export class CartController {}
