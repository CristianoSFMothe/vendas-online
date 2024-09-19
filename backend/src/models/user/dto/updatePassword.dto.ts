import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordUser {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lastPassword: string;
}
