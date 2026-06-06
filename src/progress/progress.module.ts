import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { Quest } from "../entities/quest.entity";
import { ProgressController } from "./progress.controller";
import { ProgressService } from "./progress.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserQuestProgress, UserBadge, Quest])],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
