import { Controller } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/enum/userType.enum';

@Roles(UserType.USER)
@Controller('cart')
export class CartController {}
