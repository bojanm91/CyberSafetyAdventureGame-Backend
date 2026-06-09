import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationDelivery, NotificationKind } from "../entities/notification-delivery.entity";
import { PushToken } from "../entities/push-token.entity";
import { User } from "../entities/user.entity";
import { NotificationsService } from "./notifications.service";

const SCHEDULE_TIME_ZONE = "Europe/Podgorica";

@Injectable()
export class ScheduledNotificationsService {
  private readonly logger = new Logger(ScheduledNotificationsService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PushToken)
    private readonly pushTokenRepo: Repository<PushToken>,
    @InjectRepository(NotificationDelivery)
    private readonly deliveryRepo: Repository<NotificationDelivery>,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron("0 18 * * *", {
    name: "daily-challenge-push-reminder",
    timeZone: SCHEDULE_TIME_ZONE,
  })
  async sendDailyChallengeReminder() {
    if (this.isDisabled()) return;

    const today = this.dateKey();
    const users = await this.findUsersWithPushTokens();
    let sentUsers = 0;

    for (const user of users) {
      if (await this.wasSent(user.id, "daily_challenge", today)) continue;

      const result = await this.notificationsService.sendToUser(user.id, {
        title: "Bajt ima dnevni izazov",
        body: "Današnja misija te čeka u CyberSafe Akademiji. Kratak izazov, malo XP-a i još jedan korak kroz Mrežu.",
        data: { url: "/(tabs)", type: "daily_challenge" },
      });

      if (result.sent > 0) {
        await this.markSent(user.id, "daily_challenge", today, result.sent);
        sentUsers++;
      }
    }

    this.logger.log(`Daily challenge podsjetnik poslat korisnicima: ${sentUsers}/${users.length}`);
  }

  @Cron("0 19 * * *", {
    name: "comeback-push-reminder",
    timeZone: SCHEDULE_TIME_ZONE,
  })
  async sendComebackReminder() {
    if (this.isDisabled()) return;

    const today = this.dateKey();
    const threshold = this.dateKey(-2);
    const users = await this.findUsersWithPushTokens();
    let sentUsers = 0;

    for (const user of users) {
      if (!this.shouldSendComeback(user, threshold)) continue;
      if (await this.wasSent(user.id, "comeback", today)) continue;

      const result = await this.notificationsService.sendToUser(user.id, {
        title: "Luka Lozinki te čeka",
        body: "Bajt je sačuvao tvoje mjesto na mapi. Nastavi misiju kad imaš minut i pokupi novi XP.",
        data: { url: "/(tabs)/missions", type: "comeback" },
      });

      if (result.sent > 0) {
        await this.markSent(user.id, "comeback", today, result.sent);
        sentUsers++;
      }
    }

    this.logger.log(`Comeback podsjetnik poslat korisnicima: ${sentUsers}/${users.length}`);
  }

  private isDisabled() {
    return process.env.DISABLE_SCHEDULED_PUSH === "true";
  }

  private async findUsersWithPushTokens() {
    const tokens = await this.pushTokenRepo.find({
      where: { enabled: true },
      select: { userId: true },
    });
    const userIds = [...new Set(tokens.map((token) => token.userId))];
    if (!userIds.length) return [];

    return this.userRepo
      .createQueryBuilder("user")
      .where("user.id IN (:...userIds)", { userIds })
      .getMany();
  }

  private shouldSendComeback(user: User, threshold: string) {
    if (user.lastActivity) return user.lastActivity <= threshold;

    const createdKey = this.dateKeyFromDate(user.createdAt);
    return createdKey <= threshold;
  }

  private async wasSent(userId: string, kind: NotificationKind, dateKey: string) {
    return this.deliveryRepo.exists({ where: { userId, kind, dateKey } });
  }

  private async markSent(userId: string, kind: NotificationKind, dateKey: string, sentCount: number) {
    const existing = await this.deliveryRepo.findOne({ where: { userId, kind, dateKey } });
    if (existing) return existing;

    return this.deliveryRepo.save(
      this.deliveryRepo.create({ userId, kind, dateKey, sentCount }),
    ).catch(async () => (
      this.deliveryRepo.findOne({ where: { userId, kind, dateKey } })
    ));
  }

  private dateKey(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return this.dateKeyFromDate(date);
  }

  private dateKeyFromDate(date: Date) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: SCHEDULE_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;
    return `${year}-${month}-${day}`;
  }
}
