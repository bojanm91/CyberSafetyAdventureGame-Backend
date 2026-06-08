import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { Quest } from "../entities/quest.entity";
import { User } from "../entities/user.entity";
import { Result } from "../entities/result.entity";
import { Badge } from "../entities/badge.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Quest, User, Result, Badge, UserBadge, UserQuestProgress])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
