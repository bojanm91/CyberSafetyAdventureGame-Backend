import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { Quest } from "../entities/quest.entity";

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserQuestProgress)
    private readonly progressRepo: Repository<UserQuestProgress>,
    @InjectRepository(UserBadge)
    private readonly userBadgeRepo: Repository<UserBadge>,
    @InjectRepository(Quest)
    private readonly questRepo: Repository<Quest>,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("Korisnik nije pronađen.");

    const progressRecords = await this.progressRepo.find({
      where: { user: { id: userId } },
      relations: ["quest", "quest.discipline"],
    });

    const userBadges = await this.userBadgeRepo.find({
      where: { user: { id: userId } },
      relations: ["badge"],
      order: { earnedAt: "DESC" },
    });

    const totalQuests = await this.questRepo.count({ where: { isActive: true } });
    const completedQuests = progressRecords.length;

    const disciplineStats: Record<string, { total: number; completed: number; points: number }> = {};
    for (const p of progressRecords) {
      const slug = p.quest?.discipline?.slug ?? "unknown";
      if (!disciplineStats[slug]) {
        disciplineStats[slug] = { total: 0, completed: 0, points: 0 };
      }
      disciplineStats[slug].completed += 1;
      disciplineStats[slug].points += p.score;
    }

    const xpPerLevel = 500;
    const xpInCurrentLevel = user.points % xpPerLevel;
    const xpPercentage = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

    const nextRecommended = await this.findNextRecommended(userId, progressRecords);

    return {
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
        level: user.level,
        points: user.points,
        streak: user.streak,
      },
      stats: {
        xpPercentage,
        xpToNextLevel: xpPerLevel - xpInCurrentLevel,
        completedQuests,
        totalQuests,
        badgesCount: userBadges.length,
      },
      badges: userBadges.slice(0, 6).map((ub) => ({
        id: ub.badge.id,
        name: ub.badge.name,
        icon: ub.badge.icon,
        description: ub.badge.description,
        earnedAt: ub.earnedAt,
      })),
      disciplineStats,
      nextRecommended,
    };
  }

  private async findNextRecommended(
    userId: string,
    progressRecords: UserQuestProgress[],
  ) {
    const completedIds = new Set(progressRecords.map((p) => p.quest.id));
    const allQuests = await this.questRepo.find({
      where: { isActive: true },
      relations: ["discipline"],
      order: { discipline: { order: "ASC" }, orderInDiscipline: "ASC" },
    });

    for (const q of allQuests) {
      if (!completedIds.has(q.id)) {
        if (q.orderInDiscipline === 1) {
          return { id: q.id, title: q.title, discipline: q.discipline.name };
        }
        const disciplineQuests = allQuests.filter(
          (dq) => dq.discipline.id === q.discipline.id,
        );
        const prev = disciplineQuests.find(
          (dq) => dq.orderInDiscipline === q.orderInDiscipline - 1,
        );
        if (prev && completedIds.has(prev.id)) {
          return { id: q.id, title: q.title, discipline: q.discipline.name };
        }
      }
    }
    return null;
  }
}
