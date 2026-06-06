import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Discipline } from "../entities/discipline.entity";
import { Quest } from "../entities/quest.entity";
import { QuestOption } from "../entities/quest-option.entity";
import { Badge } from "../entities/badge.entity";
import { SeedService } from "./seed.service";

@Module({
  imports: [TypeOrmModule.forFeature([Discipline, Quest, QuestOption, Badge])],
  providers: [SeedService],
})
export class SeedModule {}
