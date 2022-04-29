import { UpdatePasswordDto } from '@factotum/api-interfaces';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  public async me(@Request() req): Promise<User> {
    console.log(req);
    return req.user;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('update/password')
  public async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<{ message: string }> {
    await this.usersService.updatePassword(updatePasswordDto, req.user.id);

    return {
      message: 'password_update_success',
    };
  }
}
