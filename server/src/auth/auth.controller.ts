import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return user;
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.login(dto);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
      user,
    };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: { userId: string }) {
    return this.authService.me(user.userId);
  }
}
