import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { SigninDto } from './auth/dto/signin.dto';
import { SignupDto } from './auth/dto/signup.dto';

import { AuthService } from './auth/auth.service';
import { Tokens } from './auth/types';
import { RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('sign_in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signinDto: SigninDto): Promise<Tokens> {
    return this.authService.signIn(signinDto);
  }

  @Public()
  @Post('sign_up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signupDto: SignupDto): Promise<Tokens> {
    return this.authService.signUp(signupDto);
  }

  @Post('sign_out')
  @HttpCode(HttpStatus.OK)
  async signOut(@GetCurrentUserId() userId: number): Promise<any> {
    console.log(userId, 'id');
    return this.authService.signOut(userId);
  }

  @Get('protected')
  @HttpCode(HttpStatus.OK)
  getHello(@Request() req): string {
    return req.user;
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
