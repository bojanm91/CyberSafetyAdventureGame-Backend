import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ContentModule } from "./content/content.module";
import { ProgressModule } from "./progress/progress.module";
import { HealthModule } from "./health/health.module";
import { QuestsModule } from "./quests/quests.module";
import { SeedModule } from "./seed/seed.module";
import { User } from "./entities/user.entity";
import { Discipline } from "./entities/discipline.entity";
import { Quest } from "./entities/quest.entity";
import { QuestOption } from "./entities/quest-option.entity";
import { UserQuestProgress } from "./entities/user-quest-progress.entity";
import { Badge } from "./entities/badge.entity";
import { UserBadge } from "./entities/user-badge.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mysql",
      url: process.env.DATABASE_URL,
      entities: [User, Discipline, Quest, QuestOption, UserQuestProgress, Badge, UserBadge],
      synchronize: true,
    }),
    HealthModule,
    ContentModule,
    AuthModule,
    ProgressModule,
    QuestsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
