import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { SignupDto } from './auth/dto/signup.dto';
import { Tokens } from './auth/types';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req): Promise<any> {
    return {
      email: req.user.email,
      name: req.user.name,
      token: await this.authService.signin(req.user),
    };
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<Tokens> {
    return this.authService.signup(signupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req): Promise<any> {
    const destroyed_session = this.authService.logout();
    if (!destroyed_session) throw new Error('Error ');
    return 'msg: logout';
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }
}
