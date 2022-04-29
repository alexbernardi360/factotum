import { UserLoginDto, UserSigninDto } from '@factotum/api-interfaces';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { FormatLogin } from '../users/users.service';
import { AuthService, RegistrationStatus } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: UserSigninDto
  ): Promise<RegistrationStatus> {
    const result: RegistrationStatus = await this.authService.register(
      createUserDto
    );
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: UserLoginDto
  ): Promise<{
    data: FormatLogin;
    expiresIn: string;
    Authorization: string;
  }> {
    return await this.authService.login(loginUserDto);
  }
}
