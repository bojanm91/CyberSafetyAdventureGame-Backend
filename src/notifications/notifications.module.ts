import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationDelivery } from "../entities/notification-delivery.entity";
import { PushToken } from "../entities/push-token.entity";
import { User } from "../entities/user.entity";
import { NotificationsController } from "./notifications.controller";
import { ScheduledNotificationsService } from "./scheduled-notifications.service";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [TypeOrmModule.forFeature([PushToken, User, NotificationDelivery])],
  controllers: [NotificationsController],
  providers: [NotificationsService, ScheduledNotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
