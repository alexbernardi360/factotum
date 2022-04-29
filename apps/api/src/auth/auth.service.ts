import { UserLoginDto, UserSigninDto } from '@factotum/api-interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../app/prisma.service';
import { FormatLogin, UsersService } from '../users/users.service';
import { JwtPayload } from './jwt.strategy';

export interface RegistrationStatus {
  success: boolean;
  message: string;
  data?: User;
}

export interface RegistrationSeederStatus {
  success: boolean;
  message: string;
  data?: User[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async register(userDto: UserSigninDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS',
    };

    try {
      status.data = await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(
    loginUserDto: UserLoginDto
  ): Promise<{ data: FormatLogin; expiresIn: string; Authorization: string }> {
    // find user in db
    const user = await this.usersService.findByLogin(loginUserDto);

    // generate and sign token
    const token = this._createToken(user);

    return {
      ...token,
      data: user,
    };
  }

  private _createToken({ login }: JwtPayload): {
    expiresIn: string;
    Authorization: string;
  } {
    const user: JwtPayload = { login };
    const Authorization = this.jwtService.sign(user);

    return {
      expiresIn: process.env.EXPIRESIN,
      Authorization,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
