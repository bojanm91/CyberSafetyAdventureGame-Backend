import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../entities/user.entity";

interface AuthRequest extends Request {
  user: User;
}

@Controller("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: AuthRequest) {
    return this.progressService.getMe(req.user.id);
  }
}
