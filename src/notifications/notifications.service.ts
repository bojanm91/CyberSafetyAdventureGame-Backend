import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PushToken, PushPlatform } from "../entities/push-token.entity";
import { RegisterPushTokenDto } from "./dto/register-push-token.dto";

type ExpoPushMessage = {
  to: string;
  sound?: "default";
  title: string;
  body: string;
  data?: Record<string, unknown>;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(PushToken)
    private readonly pushTokenRepo: Repository<PushToken>,
  ) {}

  async registerPushToken(userId: string, dto: RegisterPushTokenDto) {
    const platform: PushPlatform = dto.platform ?? "unknown";
    const existing = await this.pushTokenRepo.findOneBy({ token: dto.token });

    if (existing) {
      existing.userId = userId;
      existing.platform = platform;
      existing.enabled = true;
      await this.pushTokenRepo.save(existing);
      return { registered: true };
    }

    await this.pushTokenRepo.save(
      this.pushTokenRepo.create({
        userId,
        token: dto.token,
        platform,
        enabled: true,
      }),
    );

    return { registered: true };
  }

  async unregisterPushToken(userId: string, token: string) {
    await this.pushTokenRepo.update({ userId, token }, { enabled: false });
    return { registered: false };
  }

  async sendTestNotification(userId: string) {
    return this.sendToUser(userId, {
      title: "Bajt ima poruku",
      body: "Push notifikacije rade. Sljedeći put mogu da te podsjetim na dnevni cyber izazov.",
      data: { url: "/(tabs)/missions", type: "test" },
    });
  }

  async sendToUser(
    userId: string,
    payload: Pick<ExpoPushMessage, "title" | "body" | "data">,
  ) {
    const tokens = await this.pushTokenRepo.findBy({ userId, enabled: true });
    if (tokens.length === 0) return { sent: 0, tickets: [] };

    const messages: ExpoPushMessage[] = tokens.map((t) => ({
      to: t.token,
      sound: "default",
      title: payload.title,
      body: payload.body,
      data: payload.data,
    }));

    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
        ...(process.env.EXPO_ACCESS_TOKEN
          ? { Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(messages),
    });

    const tickets = await res.json().catch(() => null);
    if (!res.ok) {
      return { sent: 0, tickets, error: "Expo Push API nije prihvatio zahtjev." };
    }

    await this.disableInvalidTokens(tokens, tickets);
    return { sent: messages.length, tickets };
  }

  private async disableInvalidTokens(tokens: PushToken[], tickets: unknown) {
    const ticketItems = Array.isArray((tickets as { data?: unknown })?.data)
      ? ((tickets as { data: Array<{ status?: string; details?: { error?: string } }> }).data)
      : [];

    const invalidIds = ticketItems
      .map((ticket, index) => (
        ticket.status === "error" && ticket.details?.error === "DeviceNotRegistered"
          ? tokens[index]?.id
          : null
      ))
      .filter((id): id is string => Boolean(id));

    if (invalidIds.length) {
      await this.pushTokenRepo.update({ id: In(invalidIds) }, { enabled: false });
    }
  }
}
