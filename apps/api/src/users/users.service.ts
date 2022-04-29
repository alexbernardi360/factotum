import {
  UpdatePasswordDto,
  UserLoginDto,
  UserSigninDto,
} from '@factotum/api-interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../app/prisma.service';

export interface FormatLogin extends Partial<User> {
  login: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /** use by user module to change user password */
  async updatePassword(payload: UpdatePasswordDto, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(payload.oldPassword, user.password);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    return await this.prisma.user.update({
      where: { id },
      data: { password: await hash(payload.newPassword, 10) },
    });
  }

  /** use by auth module to register user in database */
  async create(userDto: UserSigninDto): Promise<User> {
    // // check if the user exists in the db
    const userInDb = await this.prisma.user.findFirst({
      where: { login: userDto.login },
    });

    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }

    return await this.prisma.user.create({
      data: {
        ...userDto,
        role: 'CLIENT' as const,
        password: await hash(userDto.password, 10),
      },
    });
  }

  /** use by auth module to login user */
  async findByLogin({ login, password }: UserLoginDto): Promise<FormatLogin> {
    const user = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }

    // const { password: p, ...rest } = user;

    delete user.login;
    return user;
  }

  /** use by auth module to get user in database */
  async findByPayload({ login }): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { login },
    });
  }
}
