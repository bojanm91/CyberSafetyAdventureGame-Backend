import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThanOrEqual } from "typeorm";
import { Quest } from "../entities/quest.entity";
import { User } from "../entities/user.entity";
import { Result } from "../entities/result.entity";
import { Badge } from "../entities/badge.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { SubmitResultDto } from "./dto/submit-result.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";

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

const GAME_BADGES = [
  { slug: "prvi-korak", name: "Prvi korak", icon: "🎯", condition: "first_result" },
  { slug: "lovac-na-phishing", name: "Lovac na phishing", icon: "🎣", condition: "phishing_10" },
  { slug: "kovac-lozinki", name: "Kovač lozinki", icon: "⚒️", condition: "lozinka_5" },
  { slug: "bez-greske", name: "Bez greške", icon: "💎", condition: "perfect_topic" },
  { slug: "niz-od-7", name: "Niz od 7", icon: "🔥", condition: "streak_7" },
  { slug: "mrezni-cuvar", name: "Mrežni Čuvar", icon: "🛡️", condition: "level_9" },
  { slug: "brze-ruke", name: "Brze ruke", icon: "⚡", condition: "brzi_krug_fast" },
  { slug: "sveznalica", name: "Sveznalica", icon: "🧠", condition: "all_topics" },
  { slug: "oprezni", name: "Oprezni", icon: "👁️", condition: "threats_20" },
  { slug: "postojan", name: "Postojan", icon: "🏆", condition: "daily_30" },
];

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Quest)
    private readonly questRepo: Repository<Quest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Result)
    private readonly resultRepo: Repository<Result>,
    @InjectRepository(Badge)
    private readonly badgeRepo: Repository<Badge>,
    @InjectRepository(UserBadge)
    private readonly userBadgeRepo: Repository<UserBadge>,
    @InjectRepository(UserQuestProgress)
    private readonly progressRepo: Repository<UserQuestProgress>,
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
      const [results, progress] = await Promise.all([
        this.resultRepo.find({ where: { userId, correct: true } }),
        this.progressRepo.find({ where: { user: { id: userId } }, relations: ["quest"] }),
      ]);
      doneIds = new Set([
        ...results.filter((r) => r.questId).map((r) => r.questId!),
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

    const existingCorrectResult = await this.resultRepo.findOne({
      where: { userId, questId: dto.questId, correct: true },
    });
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

    const result = this.resultRepo.create({
      userId,
      questId: dto.questId,
      disciplineSlug: quest?.discipline?.slug ?? null,
      correct: dto.correct,
      xpEarned,
      timeMs: dto.timeMs ?? null,
    });
    await this.resultRepo.save(result);

    if (!hasCompletedProgress && quest && dto.correct) {
      const progress = existingProgress ?? this.progressRepo.create({ user, quest });
      progress.status = "completed";
      progress.score = xpEarned;
      progress.usedHint = false;
      progress.firstTry = !existingCorrectResult;
      await this.progressRepo.save(progress);
    }

    const earnedBadges = await this.checkBadges(user, dto, quest?.discipline?.slug);

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

  private async checkBadges(user: User, dto: SubmitResultDto, disciplineSlug?: string | null) {
    const earned: Array<{ name: string; icon: string }> = [];
    const existingSlugs = new Set(user.userBadges?.map((ub) => ub.badge.slug) ?? []);
    const allBadges = await this.badgeRepo.find();
    const allResults = await this.resultRepo.find({ where: { userId: user.id } });

    const allCorrect = allResults.filter((r) => r.correct);
    const slugCounts = allCorrect.reduce<Record<string, number>>((acc, r) => {
      if (r.disciplineSlug) acc[r.disciplineSlug] = (acc[r.disciplineSlug] ?? 0) + 1;
      return acc;
    }, {});
    const topicSlugsWithResults = Object.keys(slugCounts);

    for (const badge of allBadges) {
      if (existingSlugs.has(badge.slug)) continue;
      let earn = false;

      switch (badge.slug) {
        case "prvi-korak":
          earn = allResults.length === 1;
          break;
        case "lovac-na-phishing":
          earn = (slugCounts["phishing"] ?? 0) >= 10 || (slugCounts["phishing-harbor"] ?? 0) >= 10;
          break;
        case "kovac-lozinki":
          earn = (slugCounts["lozinke"] ?? 0) >= 5 || (slugCounts["password-base"] ?? 0) >= 5;
          break;
        case "niz-od-7":
          earn = user.streak >= 7;
          break;
        case "mrezni-cuvar":
          earn = computeLevel(user.points) >= 9;
          break;
        case "oprezni":
          earn = allCorrect.length >= 20;
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
    const results = await this.resultRepo.find({ where: { userId } });
    const slugMap = new Map<string, { correct: number; total: number }>();

    for (const r of results) {
      const slug = r.disciplineSlug ?? "other";
      if (!slugMap.has(slug)) slugMap.set(slug, { correct: 0, total: 0 });
      const entry = slugMap.get(slug)!;
      entry.total++;
      if (r.correct) entry.correct++;
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

    const results = await this.resultRepo.find({
      where: { userId, correct: true, createdAt: MoreThanOrEqual(since) },
      order: { createdAt: "ASC" },
    });

    const history: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      history[d.toISOString().slice(0, 10)] = 0;
    }

    for (const r of results) {
      const day = r.createdAt.toISOString().slice(0, 10);
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
