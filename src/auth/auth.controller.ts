import { Body, Controller, Delete, Post, Request, UseGuards } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { User } from "../entities/user.entity";

interface AuthRequest extends Request {
  user: User;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Delete("me")
  @UseGuards(JwtAuthGuard)
  deleteMe(@Request() req: AuthRequest) {
    return this.authService.deleteMe(req.user.id);
  }
}
