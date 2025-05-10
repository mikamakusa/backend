import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Redirige vers Google
  }

  @Get('login/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {
    // Redirige vers Facebook
  }

  @Get('redirect')
  @UseGuards(AuthGuard(['google', 'facebook']))
  redirect(@Req() req) {
    return req.user; // ou redirection frontend avec token
  }
}
