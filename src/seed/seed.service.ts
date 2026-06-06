import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Discipline } from "../entities/discipline.entity";
import { Quest } from "../entities/quest.entity";
import { QuestOption } from "../entities/quest-option.entity";
import { Badge } from "../entities/badge.entity";
import { BADGES_DATA, DISCIPLINES_DATA, QUESTS_DATA } from "./seed.data";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Discipline)
    private readonly disciplineRepo: Repository<Discipline>,
    @InjectRepository(Quest)
    private readonly questRepo: Repository<Quest>,
    @InjectRepository(QuestOption)
    private readonly optionRepo: Repository<QuestOption>,
    @InjectRepository(Badge)
    private readonly badgeRepo: Repository<Badge>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.disciplineRepo.count();
    if (count > 0) {
      this.logger.log("Baza već sadrži podatke - seed se preskače.");
      return;
    }
    this.logger.log("Pokretanje seed-a...");
    await this.seed();
    this.logger.log("Seed završen.");
  }

  private async seed() {
    const disciplineMap = new Map<string, Discipline>();
    for (const d of DISCIPLINES_DATA) {
      const disc = this.disciplineRepo.create(d);
      const saved = await this.disciplineRepo.save(disc);
      disciplineMap.set(d.slug, saved);
    }

    for (const q of QUESTS_DATA) {
      const discipline = disciplineMap.get(q.disciplineSlug);
      if (!discipline) continue;

      const quest = this.questRepo.create({
        discipline,
        title: q.title,
        difficulty: q.difficulty,
        basePoints: q.basePoints,
        questType: q.questType,
        orderInDiscipline: q.orderInDiscipline,
        scenario: q.scenario,
        taskText: q.taskText,
        hintText: q.hintText,
        feedbackCorrect: q.feedbackCorrect,
        miniConclusion: q.miniConclusion,
        isActive: true,
      });
      const savedQuest = await this.questRepo.save(quest);

      for (const opt of q.options) {
        const option = this.optionRepo.create({
          quest: savedQuest,
          text: opt.text,
          isCorrect: opt.isCorrect,
          explanation: opt.explanation,
          order: opt.order,
        });
        await this.optionRepo.save(option);
      }
    }

    for (const b of BADGES_DATA) {
      const badge = this.badgeRepo.create(b);
      await this.badgeRepo.save(badge);
    }
  }
}
