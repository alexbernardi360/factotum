import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly password: string;
}

export class UserSigninDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  oldPassword: string;
}
