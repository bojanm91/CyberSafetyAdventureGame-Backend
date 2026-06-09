import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Discipline } from "../entities/discipline.entity";
import { Quest } from "../entities/quest.entity";
import { QuestOption } from "../entities/quest-option.entity";
import { Badge } from "../entities/badge.entity";
import { BADGES_DATA, DISCIPLINES_DATA, GAME_BADGES_DATA, GAME_TOPICS_DATA, QUESTS_DATA, SCENARIOS_DATA } from "./seed.data";

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
    const disciplineCount = await this.disciplineRepo.count();
    if (disciplineCount === 0) {
      this.logger.log("Pokretanje seed-a (stari quests)...");
      await this.seedLegacy();
      this.logger.log("Legacy seed završen.");
    } else {
      this.logger.log("Legacy podaci već postoje - preskačem.");
    }

    await this.seedGameTopics();
    await this.seedAllBadges();
  }

  private async seedLegacy() {
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
        await this.optionRepo.save(this.optionRepo.create({ quest: savedQuest, ...opt }));
      }
    }
  }

  private async seedGameTopics() {
    for (const topicData of GAME_TOPICS_DATA) {
      let discipline = await this.disciplineRepo.findOneBy({ slug: topicData.slug });
      if (!discipline) {
        discipline = await this.disciplineRepo.save(
          this.disciplineRepo.create({
            slug: topicData.slug,
            name: topicData.name,
            description: topicData.opis,
            icon: topicData.ikona,
            colorClass: topicData.colorClass,
            order: topicData.order,
            lekcija: topicData.lekcija,
          }),
        );
        this.logger.log(`Kreirana disciplina: ${topicData.slug}`);
      } else {
        // Sinhronizuj tekstualna polja teme iz seed.data.ts.
        discipline.name = topicData.name;
        discipline.description = topicData.opis;
        discipline.icon = topicData.ikona;
        discipline.colorClass = topicData.colorClass;
        discipline.order = topicData.order;
        discipline.lekcija = topicData.lekcija;
        await this.disciplineRepo.save(discipline);
      }

      const scenarios = SCENARIOS_DATA.filter((s) => s.topicSlug === topicData.slug);
      for (const s of scenarios) {
        // Sadržajna polja se uvijek sinhronizuju iz seed.data.ts (jedini izvor istine),
        // pa ispravke teksta/jezika stignu u bazu i na već postojeće scenarije.
        const payload = {
          title: s.title,
          difficulty: s.difficulty as any,
          basePoints: s.xp,
          xp: s.xp,
          questType: "multiple_choice" as any,
          orderInDiscipline: s.order,
          scenario: s.tekst,
          taskText: s.tekst,
          hintText: s.hint ?? "",
          feedbackCorrect: s.objasnjenje,
          miniConclusion: s.objasnjenje.slice(0, 120),
          interactionType: s.interactionType as any,
          gameData: s.gameData as any,
          correctData: s.correctData as any,
          objasnjenje: s.objasnjenje,
          isActive: true,
        };

        const existing = await this.questRepo.findOneBy({ title: s.title, interactionType: s.interactionType as any });
        if (existing) {
          this.questRepo.merge(existing, payload);
          await this.questRepo.save(existing);
          this.logger.log(`Ažuriran scenario: ${s.title}`);
        } else {
          await this.questRepo.save(this.questRepo.create({ discipline, ...payload }));
          this.logger.log(`Kreiran scenario: ${s.title}`);
        }
      }
    }
  }

  private async seedAllBadges() {
    const allBadgeSlugs = [...BADGES_DATA, ...GAME_BADGES_DATA];
    for (const b of allBadgeSlugs) {
      const exists = await this.badgeRepo.findOneBy({ slug: b.slug });
      if (!exists) {
        await this.badgeRepo.save(this.badgeRepo.create(b));
      } else {
        this.badgeRepo.merge(exists, b);
        await this.badgeRepo.save(exists);
      }
    }
  }
}
