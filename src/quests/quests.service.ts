import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quest } from "../entities/quest.entity";
import { QuestOption } from "../entities/quest-option.entity";
import { Discipline } from "../entities/discipline.entity";
import { User } from "../entities/user.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { Badge } from "../entities/badge.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { SubmitAnswerDto } from "./dto/submit-answer.dto";

const STATUS_LEVELS = [
  "Cyber Rookie",
  "Junior Defender",
  "Security Scout",
  "Phishing Hunter",
  "Cyber Guardian",
];

function computeLevel(points: number) {
  return Math.floor(points / 500) + 1;
}

function computeStatus(level: number) {
  const idx = Math.min(Math.floor((level - 1) / 2), STATUS_LEVELS.length - 1);
  return STATUS_LEVELS[idx];
}

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest)
    private readonly questRepo: Repository<Quest>,
    @InjectRepository(QuestOption)
    private readonly optionRepo: Repository<QuestOption>,
    @InjectRepository(Discipline)
    private readonly disciplineRepo: Repository<Discipline>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserQuestProgress)
    private readonly progressRepo: Repository<UserQuestProgress>,
    @InjectRepository(Badge)
    private readonly badgeRepo: Repository<Badge>,
    @InjectRepository(UserBadge)
    private readonly userBadgeRepo: Repository<UserBadge>,
  ) {}

  async getDisciplines() {
    return this.disciplineRepo.find({ order: { order: "ASC" } });
  }

  async getQuestsWithStatus(userId?: string) {
    const allQuests = await this.questRepo.find({
      relations: ["discipline"],
      order: { discipline: { order: "ASC" }, orderInDiscipline: "ASC" },
      where: { isActive: true },
    });

    if (!userId) {
      return allQuests.map((q) => ({
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        basePoints: q.basePoints,
        questType: q.questType,
        orderInDiscipline: q.orderInDiscipline,
        discipline: { id: q.discipline.id, name: q.discipline.name, slug: q.discipline.slug, icon: q.discipline.icon, colorClass: q.discipline.colorClass },
        status: q.orderInDiscipline === 1 ? "available" : "locked",
        score: null,
      }));
    }

    const progressRecords = await this.progressRepo.find({
      where: { user: { id: userId } },
      relations: ["quest"],
    });

    const completedQuestIds = new Set(progressRecords.map((p) => p.quest.id));
    const progressByQuestId = new Map(progressRecords.map((p) => [p.quest.id, p]));

    const questsByDiscipline: Record<string, Quest[]> = {};
    for (const q of allQuests) {
      const key = q.discipline.id;
      if (!questsByDiscipline[key]) questsByDiscipline[key] = [];
      questsByDiscipline[key].push(q);
    }

    return allQuests.map((q) => {
      const prog = progressByQuestId.get(q.id);
      let status: string;
      let score: number | null = null;

      if (prog) {
        status = prog.status;
        score = prog.score;
      } else if (q.orderInDiscipline === 1) {
        status = "available";
      } else {
        const disciplineQuests = questsByDiscipline[q.discipline.id] ?? [];
        const prev = disciplineQuests.find(
          (dq) => dq.orderInDiscipline === q.orderInDiscipline - 1,
        );
        status = prev && completedQuestIds.has(prev.id) ? "available" : "locked";
      }

      return {
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        basePoints: q.basePoints,
        questType: q.questType,
        orderInDiscipline: q.orderInDiscipline,
        discipline: { id: q.discipline.id, name: q.discipline.name, slug: q.discipline.slug, icon: q.discipline.icon, colorClass: q.discipline.colorClass },
        status,
        score,
      };
    });
  }

  async getQuestById(id: string, userId?: string) {
    const quest = await this.questRepo.findOne({
      where: { id, isActive: true },
      relations: ["discipline", "options"],
    });
    if (!quest) throw new NotFoundException("Quest nije pronađen.");

    const optionsWithoutAnswer = quest.options
      .sort((a, b) => a.order - b.order)
      .map((o) => ({
        id: o.id,
        text: o.text,
        order: o.order,
      }));

    let userProgress = null;
    if (userId) {
      const prog = await this.progressRepo.findOne({
        where: { user: { id: userId }, quest: { id } },
      });
      if (prog) {
        const correctOption = quest.options.find((o) => o.isCorrect);
        userProgress = {
          status: prog.status,
          score: prog.score,
          usedHint: prog.usedHint,
          correctOptionId: correctOption?.id ?? null,
        };
      }
    }

    return {
      id: quest.id,
      title: quest.title,
      difficulty: quest.difficulty,
      basePoints: quest.basePoints,
      questType: quest.questType,
      scenario: quest.scenario,
      taskText: quest.taskText,
      hintText: quest.hintText,
      miniConclusion: quest.miniConclusion,
      discipline: {
        id: quest.discipline.id,
        name: quest.discipline.name,
        slug: quest.discipline.slug,
        icon: quest.discipline.icon,
      },
      options: optionsWithoutAnswer,
      userProgress,
    };
  }

  async submitAnswer(userId: string, dto: SubmitAnswerDto) {
    const quest = await this.questRepo.findOne({
      where: { id: dto.questId, isActive: true },
      relations: ["discipline", "options"],
    });
    if (!quest) throw new NotFoundException("Quest nije pronađen.");

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["questProgress", "userBadges", "userBadges.badge"],
    });
    if (!user) throw new NotFoundException("Korisnik nije pronađen.");

    const selectedOption = quest.options.find((o) => o.id === dto.optionId);
    if (!selectedOption) throw new NotFoundException("Opcija nije pronađena.");

    const correctOption = quest.options.find((o) => o.isCorrect);
    const isCorrect = selectedOption.isCorrect;

    const usedHint = dto.usedHint ?? false;
    let score = 0;
    if (isCorrect) {
      score = quest.basePoints;
      if (!usedHint) score += 25;
    }

    const existingProgress = await this.progressRepo.findOne({
      where: { user: { id: userId }, quest: { id: dto.questId } },
    });

    if (!existingProgress) {
      const status = isCorrect && !usedHint && score === quest.basePoints + 25
        ? "mastered"
        : isCorrect
          ? "completed"
          : "completed";

      const progress = this.progressRepo.create({
        user,
        quest,
        status,
        score,
        usedHint,
        firstTry: true,
      });
      await this.progressRepo.save(progress);

      if (isCorrect) {
        user.points += score;
        user.level = computeLevel(user.points);
        user.status = computeStatus(user.level);
      }

      const today = new Date().toISOString().slice(0, 10);
      if (user.lastActivity) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (user.lastActivity === yesterday) {
          user.streak += 1;
        } else if (user.lastActivity !== today) {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }
      user.lastActivity = today;
      await this.userRepo.save(user);
    }

    const earnedBadges = await this.checkAndAwardBadges(user, quest, isCorrect, usedHint);

    return {
      correct: isCorrect,
      score,
      correctOptionId: correctOption?.id ?? null,
      feedbackCorrect: quest.feedbackCorrect,
      miniConclusion: quest.miniConclusion,
      selectedOptionExplanation: selectedOption.explanation ?? null,
      earnedBadges,
      user: {
        points: user.points,
        level: user.level,
        status: user.status,
        streak: user.streak,
      },
    };
  }

  private async checkAndAwardBadges(
    user: User,
    quest: Quest,
    isCorrect: boolean,
    usedHint: boolean,
  ): Promise<Array<{ name: string; icon: string }>> {
    const earnedBadges: Array<{ name: string; icon: string }> = [];
    const existingBadgeSlugs = new Set(
      user.userBadges?.map((ub) => ub.badge.slug) ?? [],
    );

    const allBadges = await this.badgeRepo.find();
    const allProgress = await this.progressRepo.find({
      where: { user: { id: user.id } },
      relations: ["quest", "quest.discipline"],
    });

    for (const badge of allBadges) {
      if (existingBadgeSlugs.has(badge.slug)) continue;

      let earned = false;

      if (badge.conditionType === "no_hint" && isCorrect && !usedHint) {
        earned = true;
      } else if (badge.conditionType === "perfect_score" && isCorrect && !usedHint) {
        earned = true;
      } else if (badge.conditionType === "discipline_complete" && badge.conditionValue) {
        const disciplineProgress = allProgress.filter(
          (p) => p.quest.discipline?.slug === badge.conditionValue,
        );
        const allQuestsInDiscipline = await this.questRepo.find({
          where: { discipline: { slug: badge.conditionValue }, isActive: true },
        });
        if (
          allQuestsInDiscipline.length > 0 &&
          disciplineProgress.length >= allQuestsInDiscipline.length
        ) {
          earned = true;
        }
      } else if (badge.conditionType === "all_complete") {
        const allActiveQuests = await this.questRepo.find({ where: { isActive: true } });
        if (allProgress.length >= allActiveQuests.length) {
          earned = true;
        }
      } else if (badge.conditionType === "quests_count" && badge.conditionValue) {
        const required = parseInt(badge.conditionValue, 10);
        if (allProgress.length >= required) earned = true;
      }

      if (earned) {
        const ub = this.userBadgeRepo.create({ user, badge });
        await this.userBadgeRepo.save(ub);
        earnedBadges.push({ name: badge.name, icon: badge.icon });
        existingBadgeSlugs.add(badge.slug);
      }
    }

    return earnedBadges;
  }
}
