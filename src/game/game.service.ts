import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { DataSource, Repository } from "typeorm";
import { Quest } from "../entities/quest.entity";
import { User } from "../entities/user.entity";
import { Badge } from "../entities/badge.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { SubmitResultDto } from "./dto/submit-result.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";

type ResultRow = {
  id?: string;
  questId: string | null;
  disciplineSlug: string | null;
  correct: boolean | number | string;
  xpEarned: number;
  createdAt?: Date | string;
};

function isCorrect(value: ResultRow["correct"]) {
  return value === true || value === 1 || value === "1";
}

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

const RANK_TIERS = [
  { min: 1, max: 2, rank: "Pripravnik" },
  { min: 3, max: 4, rank: "Analitičar" },
  { min: 5, max: 6, rank: "Agent" },
  { min: 7, max: 8, rank: "Specijalista" },
  { min: 9, max: 99, rank: "Mrežni Čuvar" },
];

const XP_LEVELS = [0, 100, 250, 450, 700, 1000, 1300, 1600, 1900, 2200];

function computeLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xp >= XP_LEVELS[i]) level = i + 1;
    else break;
  }
  return level;
}

function computeRank(level: number): string {
  const tier = RANK_TIERS.find((t) => level >= t.min && level <= t.max);
  return tier?.rank ?? "Mrežni Čuvar";
}

function xpForNextLevel(level: number): number {
  return XP_LEVELS[level] ?? XP_LEVELS[XP_LEVELS.length - 1] + 300;
}

const GAME_BADGE_SLUGS = new Set([
  "prvi-korak",
  "lovac-na-phishing",
  "kovac-lozinki",
  "bez-greske",
  "niz-od-7",
  "mrezni-cuvar",
  "brze-ruke",
  "sveznalica",
  "oprezni",
  "postojan",
]);

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Quest)
    private readonly questRepo: Repository<Quest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Badge)
    private readonly badgeRepo: Repository<Badge>,
    @InjectRepository(UserBadge)
    private readonly userBadgeRepo: Repository<UserBadge>,
    @InjectRepository(UserQuestProgress)
    private readonly progressRepo: Repository<UserQuestProgress>,
    private readonly dataSource: DataSource,
  ) {}

  async getTopics() {
    const { Discipline } = await import("../entities/discipline.entity");
    // Return disciplines that have game scenarios
    const quests = await this.questRepo.find({
      where: { isActive: true },
      relations: ["discipline"],
    });
    const topicMap = new Map<string, { slug: string; name: string; icon: string; lekcija: string | null; count: number }>();
    for (const q of quests) {
      if (!q.interactionType) continue;
      const d = q.discipline;
      if (!topicMap.has(d.slug)) {
        topicMap.set(d.slug, { slug: d.slug, name: d.name, icon: d.icon, lekcija: (d as any).lekcija ?? null, count: 0 });
      }
      topicMap.get(d.slug)!.count++;
    }
    return Array.from(topicMap.values());
  }

  async getScenarios(disciplineSlug?: string, userId?: string) {
    const where: Record<string, unknown> = { isActive: true };
    const quests = await this.questRepo.find({
      where,
      relations: ["discipline"],
      order: { discipline: { order: "ASC" }, orderInDiscipline: "ASC" },
    });

    const gameQuests = quests.filter(
      (q) => q.interactionType != null && (!disciplineSlug || q.discipline.slug === disciplineSlug),
    );

    let doneIds = new Set<string>();
    if (userId) {
      await ensureResultsTable(this.dataSource);
      const [results, progress] = await Promise.all([
        this.dataSource.query<Array<{ questId: string | null }>>(
          "SELECT questId FROM results WHERE userId = ? AND correct = 1",
          [userId],
        ),
        this.progressRepo.find({ where: { user: { id: userId } }, relations: ["quest"] }),
      ]);
      doneIds = new Set([
        ...results.filter((r) => r.questId).map((r) => r.questId as string),
        ...progress.filter((p) => p.score > 0).map((p) => p.quest.id),
      ]);
    }

    return gameQuests.map((q) => ({
      id: q.id,
      title: q.title,
      interactionType: q.interactionType,
      difficulty: q.difficulty,
      xp: q.xp || q.basePoints,
      discipline: { slug: q.discipline.slug, name: q.discipline.name, icon: q.discipline.icon },
      completed: doneIds.has(q.id),
    }));
  }

  async getScenario(id: string) {
    const quest = await this.questRepo.findOne({
      where: { id, isActive: true },
      relations: ["discipline"],
    });
    if (!quest) throw new NotFoundException("Scenarij nije pronađen.");

    return {
      id: quest.id,
      title: quest.title,
      interactionType: quest.interactionType,
      difficulty: quest.difficulty,
      xp: quest.xp || quest.basePoints,
      tekst: quest.taskText || quest.scenario,
      gameData: quest.gameData,
      correctData: quest.correctData,
      objasnjenje: quest.objasnjenje || quest.feedbackCorrect,
      discipline: {
        slug: quest.discipline.slug,
        name: quest.discipline.name,
        icon: quest.discipline.icon,
      },
    };
  }

  async submitResult(userId: string, dto: SubmitResultDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["userBadges", "userBadges.badge"],
    });
    if (!user) throw new NotFoundException("Korisnik nije pronađen.");

    const quest = await this.questRepo.findOne({
      where: { id: dto.questId },
      relations: ["discipline"],
    });

    await ensureResultsTable(this.dataSource);
    const existingCorrectRows = await this.dataSource.query<Array<{ id: string }>>(
      "SELECT id FROM results WHERE userId = ? AND questId = ? AND correct = 1 LIMIT 1",
      [userId, dto.questId],
    );
    const existingCorrectResult = existingCorrectRows[0] ?? null;
    const existingProgress = await this.progressRepo.findOne({
      where: { user: { id: userId }, quest: { id: dto.questId } },
    });
    const hasCompletedProgress = !!existingProgress && existingProgress.score > 0;

    let xpEarned = 0;
    let leveledUp = false;
    const prevLevel = computeLevel(user.points);

    if (!existingCorrectResult && !hasCompletedProgress && dto.correct) {
      xpEarned = dto.xpEarned;
      user.points += xpEarned;

      const today = new Date().toISOString().slice(0, 10);
      if (user.lastActivity) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (user.lastActivity === yesterday) user.streak += 1;
        else if (user.lastActivity !== today) user.streak = 1;
      } else {
        user.streak = 1;
      }
      user.lastActivity = today;
    }

    const newLevel = computeLevel(user.points);
    if (newLevel > prevLevel) {
      leveledUp = true;
      user.level = newLevel;
      user.status = computeRank(newLevel);
    }

    await this.userRepo.save(user);

    await this.dataSource.query(
      "INSERT INTO results (id, userId, questId, disciplineSlug, correct, xpEarned, timeMs) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        randomUUID(),
        userId,
        dto.questId,
        quest?.discipline?.slug ?? null,
        dto.correct ? 1 : 0,
        xpEarned,
        dto.timeMs ?? null,
      ],
    );

    if (!hasCompletedProgress && quest && dto.correct) {
      const progress = existingProgress ?? this.progressRepo.create({ user, quest });
      progress.status = "completed";
      progress.score = xpEarned;
      progress.usedHint = false;
      progress.firstTry = !existingCorrectResult;
      await this.progressRepo.save(progress);
    }

    const earnedBadges = await this.checkBadges(user, dto);

    return {
      correct: dto.correct,
      xpEarned,
      leveledUp,
      newLevel: user.level,
      newRank: computeRank(user.level),
      xpTotal: user.points,
      xpToNextLevel: xpForNextLevel(user.level) - user.points,
      streak: user.streak,
      earnedBadges,
    };
  }

  private async checkBadges(user: User, dto: SubmitResultDto) {
    const earned: Array<{ name: string; icon: string }> = [];
    const existingSlugs = new Set(user.userBadges?.map((ub) => ub.badge.slug) ?? []);
    const allBadges = await this.badgeRepo.find();
    await ensureResultsTable(this.dataSource);
    const allResults = await this.dataSource.query<ResultRow[]>(
      "SELECT correct, disciplineSlug, xpEarned, questId FROM results WHERE userId = ?",
      [user.id],
    );
    const activeGameQuests = (await this.questRepo.find({
      where: { isActive: true },
      relations: ["discipline"],
    })).filter((q) => q.interactionType != null);
    const questSlugById = new Map(
      activeGameQuests.map((q) => [q.id, q.discipline?.slug ?? q.discipline?.name ?? "other"]),
    );
    const totalBySlug = activeGameQuests.reduce<Record<string, number>>((acc, q) => {
      const slug = q.discipline?.slug ?? "other";
      acc[slug] = (acc[slug] ?? 0) + 1;
      return acc;
    }, {});
    const topicSlugs = Object.keys(totalBySlug);

    const progressRecords = (await this.progressRepo.find({
      where: { user: { id: user.id } },
      relations: ["quest", "quest.discipline"],
    })).filter((p) => p.score > 0 && p.quest?.interactionType != null);

    const completedQuestIds = new Set<string>();
    const completedBySlug: Record<string, Set<string>> = {};
    const correctBySlug: Record<string, Set<string>> = {};
    const wrongBySlug: Record<string, number> = {};

    const mark = (bucket: Record<string, Set<string>>, slug: string, questId: string) => {
      if (!bucket[slug]) bucket[slug] = new Set<string>();
      bucket[slug].add(questId);
    };

    for (const r of allResults) {
      if (!r.questId) continue;
      const slug = questSlugById.get(r.questId) ?? r.disciplineSlug ?? "other";
      if (isCorrect(r.correct)) {
        completedQuestIds.add(r.questId);
        mark(completedBySlug, slug, r.questId);
        mark(correctBySlug, slug, r.questId);
      } else {
        wrongBySlug[slug] = (wrongBySlug[slug] ?? 0) + 1;
      }
    }

    for (const p of progressRecords) {
      const questId = p.quest.id;
      const slug = p.quest.discipline?.slug ?? "other";
      completedQuestIds.add(questId);
      mark(completedBySlug, slug, questId);
      mark(correctBySlug, slug, questId);
    }

    const completedCountBySlug = Object.fromEntries(
      Object.entries(completedBySlug).map(([slug, ids]) => [slug, ids.size]),
    ) as Record<string, number>;
    const correctCountBySlug = Object.fromEntries(
      Object.entries(correctBySlug).map(([slug, ids]) => [slug, ids.size]),
    ) as Record<string, number>;

    const requiredTopicCount = (slug: string, desired: number) => {
      const total = totalBySlug[slug] ?? desired;
      return total > 0 ? Math.min(desired, total) : desired;
    };
    const completedTopics = topicSlugs.filter((slug) => (completedCountBySlug[slug] ?? 0) > 0);
    const perfectTopic = topicSlugs.some((slug) => {
      const total = totalBySlug[slug] ?? 0;
      return total > 0 &&
        (completedCountBySlug[slug] ?? 0) >= total &&
        (correctCountBySlug[slug] ?? 0) >= total &&
        (wrongBySlug[slug] ?? 0) === 0;
    });

    for (const badge of allBadges) {
      if (!GAME_BADGE_SLUGS.has(badge.slug)) continue;
      if (existingSlugs.has(badge.slug)) continue;
      let earn = false;

      switch (badge.slug) {
        case "prvi-korak":
          earn = completedQuestIds.size >= 1;
          break;
        case "lovac-na-phishing":
          earn = (completedCountBySlug.phishing ?? 0) >= requiredTopicCount("phishing", 10);
          break;
        case "kovac-lozinki":
          earn = (completedCountBySlug.lozinke ?? 0) >= requiredTopicCount("lozinke", 5);
          break;
        case "bez-greske":
          earn = perfectTopic;
          break;
        case "brze-ruke":
          earn = dto.correct && dto.timeMs != null && dto.timeMs <= 30000;
          break;
        case "sveznalica":
          earn = topicSlugs.length > 0 && completedTopics.length >= topicSlugs.length;
          break;
        case "niz-od-7":
          earn = user.streak >= 7;
          break;
        case "mrezni-cuvar":
          earn = computeLevel(user.points) >= 9;
          break;
        case "oprezni":
          earn = completedQuestIds.size >= Math.min(20, activeGameQuests.length || 20);
          break;
        case "postojan":
          earn = user.streak >= 30;
          break;
      }

      if (earn) {
        const ub = this.userBadgeRepo.create({ user, badge });
        await this.userBadgeRepo.save(ub);
        earned.push({ name: badge.name, icon: badge.icon });
        existingSlugs.add(badge.slug);
      }
    }

    return earned;
  }

  async getLeaderboard() {
    const users = await this.userRepo.find({
      order: { points: "DESC" },
      take: 20,
    });

    return users.map((u, idx) => ({
      rank: idx + 1,
      id: u.id,
      username: u.username,
      codename: u.codename,
      avatarBase: u.avatarBase,
      avatarColor: u.avatarColor,
      level: u.level,
      points: u.points,
      rankTier: computeRank(u.level),
    }));
  }

  async updateAvatar(userId: string, dto: UpdateAvatarDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException("Korisnik nije pronađen.");

    if (dto.codename !== undefined) user.codename = dto.codename;
    if (dto.avatarBase !== undefined) user.avatarBase = dto.avatarBase;
    if (dto.avatarColor !== undefined) user.avatarColor = dto.avatarColor;
    if (dto.avatarGear !== undefined) user.avatarGear = dto.avatarGear;
    if (dto.onboardingDone !== undefined) user.onboardingDone = dto.onboardingDone;

    await this.userRepo.save(user);
    return {
      codename: user.codename,
      avatarBase: user.avatarBase,
      avatarColor: user.avatarColor,
      avatarGear: user.avatarGear,
      onboardingDone: user.onboardingDone,
    };
  }

  async getDailyChallenge() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const quests = await this.questRepo.find({
      where: { isActive: true, interactionType: "brzi_krug" as any },
      relations: ["discipline"],
    });

    if (!quests.length) {
      const fallback = await this.questRepo.find({
        where: { isActive: true },
        relations: ["discipline"],
        take: 1,
        order: { orderInDiscipline: "ASC" },
      });
      if (!fallback.length) return null;
      const q = fallback[0];
      return { id: q.id, title: q.title, discipline: q.discipline.name, xp: q.xp || q.basePoints, interactionType: q.interactionType };
    }

    const idx = seed % quests.length;
    const q = quests[idx];
    return {
      id: q.id,
      title: q.title,
      discipline: q.discipline.name,
      xp: q.xp || q.basePoints,
      interactionType: q.interactionType,
      date: today.toISOString().slice(0, 10),
    };
  }

  async getMastery(userId: string) {
    await ensureResultsTable(this.dataSource);
    const results = await this.dataSource.query<ResultRow[]>(
      "SELECT correct, disciplineSlug, questId, xpEarned FROM results WHERE userId = ?",
      [userId],
    );
    const slugMap = new Map<string, { correct: number; total: number }>();

    for (const r of results) {
      const slug = r.disciplineSlug ?? "other";
      if (!slugMap.has(slug)) slugMap.set(slug, { correct: 0, total: 0 });
      const entry = slugMap.get(slug)!;
      entry.total++;
      if (isCorrect(r.correct)) entry.correct++;
    }

    const mastery: Record<string, number> = {};
    for (const [slug, { correct, total }] of slugMap) {
      mastery[slug] = total > 0 ? Math.round((correct / total) * 100) : 0;
    }
    return mastery;
  }

  async getXpHistory(userId: string) {
    const since = new Date();
    since.setDate(since.getDate() - 13);

    await ensureResultsTable(this.dataSource);
    const results = await this.dataSource.query<Array<{ xpEarned: number; createdAt: Date | string }>>(
      "SELECT xpEarned, createdAt FROM results WHERE userId = ? AND correct = 1 AND createdAt >= ? ORDER BY createdAt ASC",
      [userId, since],
    );

    const history: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      history[d.toISOString().slice(0, 10)] = 0;
    }

    for (const r of results) {
      const day = new Date(r.createdAt).toISOString().slice(0, 10);
      if (day in history) history[day] += r.xpEarned;
    }

    return Object.entries(history).map(([date, xp]) => ({ date, xp }));
  }

  // ── Bajt: zanimljiva činjenica/savjet (Hugging Face LLM + fallback) ──────────

  private static readonly BYTE_FALLBACK_FACTS = [
    "Lozinka od 12 nasumičnih znakova je milionima puta teža za provaljivanje od one sa 8 znakova. Dužina je važnija od simbola!",
    "Dvofaktorska autentifikacija zaustavlja preko 99% automatskih napada na naloge — uključi je svuda gdje možeš.",
    "Phishing poruke najčešće stvaraju osjećaj hitnosti ('reaguj odmah!'). Kad te neko žuri — to je znak da staneš i provjeriš.",
    "Javni Wi-Fi bez lozinke može svako da prisluškuje. Koristi VPN ili mobilni internet za prijave na bitne naloge.",
    "Iste lozinke na više sajtova = ako procuri jedna, svi padaju. Menadžer lozinki pamti jedinstvene umjesto tebe.",
    "Ažuriranja nisu dosadna — ona krpe rupe kroz koje virusi ulaze. Odlaganje ažuriranja je kao da ostaviš vrata otključana.",
    "Prije nego klikneš na link, zadrži prst (ili kursor) na njemu da vidiš pravu adresu. Lažni sajtovi često imaju sitnu grešku u imenu.",
    "Banke i institucije nikad ne traže lozinku ili PIN preko poruke ili mejla. Ako to traže — to je prevara.",
    "Zaključavanje telefona PIN-om ili otiskom štiti sve tvoje naloge ako ga izgubiš. Mali korak, velika razlika.",
    "Backup bitnih podataka znači da te ransomware (ucjenjivački virus) ne može uceniti — samo vratiš svoju kopiju.",
  ];

  private pickFallbackFact(): { fact: string; source: "fallback" } {
    const list = GameService.BYTE_FALLBACK_FACTS;
    return { fact: list[Math.floor(Math.random() * list.length)], source: "fallback" };
  }

  async getByteFact(): Promise<{ fact: string; source: "ai" | "fallback" }> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) return this.pickFallbackFact();

    const model = process.env.HF_MODEL ?? "meta-llama/Llama-3.1-8B-Instruct";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "Ti si Bajt, prijateljski robot-čuvar koji uči mlade o sajber bezbjednosti. " +
                "Daj TAČNO jednu kratku, zanimljivu i tačnu činjenicu ili praktičan savjet o sajber " +
                "bezbjednosti, na srpskom jeziku (ijekavica), najviše dvije rečenice. Budi vedar i " +
                "konkretan. Bez uvoda, bez emodžija, vrati samo činjenicu.",
            },
            { role: "user", content: "Daj mi jednu zanimljivu činjenicu o sajber bezbjednosti." },
          ],
          max_tokens: 120,
          temperature: 0.9,
        }),
        signal: controller.signal,
      });

      if (!res.ok) return this.pickFallbackFact();
      const data: any = await res.json();
      const text: string | undefined = data?.choices?.[0]?.message?.content?.trim();
      if (!text) return this.pickFallbackFact();
      // Skini eventualne navodnike i suvišan razmak.
      const fact = text.replace(/^["'\s]+|["'\s]+$/g, "");
      return { fact, source: "ai" };
    } catch {
      return this.pickFallbackFact();
    } finally {
      clearTimeout(timeout);
    }
  }
}
