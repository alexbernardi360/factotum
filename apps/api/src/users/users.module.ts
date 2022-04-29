import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../app/prisma.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRETKEY,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
  ],
  controllers: [UsersController],
  providers: [AuthService, UsersService, JwtStrategy, PrismaService],
  exports: [PassportModule, JwtModule],
})
export class UsersModule {}
