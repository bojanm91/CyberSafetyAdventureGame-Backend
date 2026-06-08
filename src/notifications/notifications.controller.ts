import { Body, Controller, Delete, Post, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../entities/user.entity";
import { RegisterPushTokenDto } from "./dto/register-push-token.dto";
import { NotificationsService } from "./notifications.service";

interface AuthRequest extends Request {
  user: User;
}

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post("push-token")
  registerPushToken(@Request() req: AuthRequest, @Body() dto: RegisterPushTokenDto) {
    return this.notificationsService.registerPushToken(req.user.id, dto);
  }

  @Delete("push-token")
  unregisterPushToken(@Request() req: AuthRequest, @Body() dto: RegisterPushTokenDto) {
    return this.notificationsService.unregisterPushToken(req.user.id, dto.token);
  }

  @Post("test")
  sendTest(@Request() req: AuthRequest) {
    return this.notificationsService.sendTestNotification(req.user.id);
  }
}
