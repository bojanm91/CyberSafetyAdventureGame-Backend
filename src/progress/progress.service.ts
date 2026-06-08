import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { Quest } from "../entities/quest.entity";

type ResultProgressRow = {
  questId: string | null;
  disciplineSlug: string | null;
  xpEarned: number;
};

async function ensureResultsTable(db: DataSource) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS results (
      id varchar(36) NOT NULL,
      userId varchar(36) NOT NULL,
      questId varchar(36) NULL,
      disciplineSlug varchar(50) NULL,
      correct tinyint(1) NOT NULL,
      xpEarned int NOT NULL DEFAULT 0,
      timeMs int NULL,
      createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      PRIMARY KEY (id),
      INDEX IDX_results_userId (userId),
      INDEX IDX_results_questId (questId),
      INDEX IDX_results_user_correct (userId, correct)
    ) ENGINE=InnoDB
  `);
}

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
    private readonly dataSource: DataSource,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("Korisnik nije pronađen.");

    const rawProgressRecords = await this.progressRepo.find({
      where: { user: { id: userId } },
      relations: ["quest", "quest.discipline"],
    });
    const progressRecords = rawProgressRecords.filter((p) => p.score > 0);
    await ensureResultsTable(this.dataSource);
    const resultRecords = await this.dataSource.query<ResultProgressRow[]>(
      "SELECT questId, disciplineSlug, xpEarned FROM results WHERE userId = ? AND correct = 1",
      [userId],
    );

    const userBadges = await this.userBadgeRepo.find({
      where: { user: { id: userId } },
      relations: ["badge"],
      order: { earnedAt: "DESC" },
    });

    const activeQuests = (await this.questRepo.find({
      where: { isActive: true },
      relations: ["discipline"],
    })).filter((q) => q.interactionType != null);
    const activeQuestIds = new Set(activeQuests.map((q) => q.id));
    const activeQuestSlugs = new Map(
      activeQuests.map((q) => [q.id, q.discipline?.slug ?? "unknown"]),
    );
    const totalQuests = activeQuests.length;
    const completedQuestIds = new Set(
      progressRecords.map((p) => p.quest.id).filter((id) => activeQuestIds.has(id)),
    );
    for (const r of resultRecords) {
      if (r.questId && activeQuestIds.has(r.questId)) completedQuestIds.add(r.questId);
    }
    const completedQuests = completedQuestIds.size;

    const disciplineStats: Record<string, { total: number; completed: number; points: number }> = {};
    for (const q of activeQuests) {
      const slug = q.discipline?.slug ?? "unknown";
      if (!disciplineStats[slug]) {
        disciplineStats[slug] = { total: 0, completed: 0, points: 0 };
      }
      disciplineStats[slug].total += 1;
    }
    for (const p of progressRecords) {
      if (!activeQuestIds.has(p.quest.id)) continue;
      const slug = p.quest?.discipline?.slug ?? "unknown";
      if (!disciplineStats[slug]) {
        disciplineStats[slug] = { total: 0, completed: 0, points: 0 };
      }
      disciplineStats[slug].completed += 1;
      disciplineStats[slug].points += p.score;
    }
    const progressQuestIds = new Set(progressRecords.map((p) => p.quest.id));
    const countedResultQuestIds = new Set<string>();
    for (const r of resultRecords) {
      if (!r.questId || !activeQuestIds.has(r.questId) || progressQuestIds.has(r.questId) || countedResultQuestIds.has(r.questId)) {
        continue;
      }
      countedResultQuestIds.add(r.questId);
      const slug = activeQuestSlugs.get(r.questId) ?? r.disciplineSlug ?? "unknown";
      if (!disciplineStats[slug]) {
        disciplineStats[slug] = { total: 0, completed: 0, points: 0 };
      }
      disciplineStats[slug].completed += 1;
      disciplineStats[slug].points += r.xpEarned;
    }

    const xpPerLevel = 500;
    const xpInCurrentLevel = user.points % xpPerLevel;
    const xpPercentage = Math.round((xpInCurrentLevel / xpPerLevel) * 100);

    const nextRecommended = await this.findNextRecommended(completedQuestIds);

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

  private async findNextRecommended(completedIds: Set<string>) {
    const allQuests = (await this.questRepo.find({
      where: { isActive: true },
      relations: ["discipline"],
      order: { discipline: { order: "ASC" }, orderInDiscipline: "ASC" },
    })).filter((q) => q.interactionType != null);

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
