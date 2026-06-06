"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quest_entity_1 = require("../entities/quest.entity");
const quest_option_entity_1 = require("../entities/quest-option.entity");
const discipline_entity_1 = require("../entities/discipline.entity");
const user_entity_1 = require("../entities/user.entity");
const user_quest_progress_entity_1 = require("../entities/user-quest-progress.entity");
const badge_entity_1 = require("../entities/badge.entity");
const user_badge_entity_1 = require("../entities/user-badge.entity");
const STATUS_LEVELS = [
    "Cyber Rookie",
    "Junior Defender",
    "Security Scout",
    "Phishing Hunter",
    "Cyber Guardian",
];
function computeLevel(points) {
    return Math.floor(points / 500) + 1;
}
function computeStatus(level) {
    const idx = Math.min(Math.floor((level - 1) / 2), STATUS_LEVELS.length - 1);
    return STATUS_LEVELS[idx];
}
let QuestsService = class QuestsService {
    questRepo;
    optionRepo;
    disciplineRepo;
    userRepo;
    progressRepo;
    badgeRepo;
    userBadgeRepo;
    constructor(questRepo, optionRepo, disciplineRepo, userRepo, progressRepo, badgeRepo, userBadgeRepo) {
        this.questRepo = questRepo;
        this.optionRepo = optionRepo;
        this.disciplineRepo = disciplineRepo;
        this.userRepo = userRepo;
        this.progressRepo = progressRepo;
        this.badgeRepo = badgeRepo;
        this.userBadgeRepo = userBadgeRepo;
    }
    async getDisciplines() {
        return this.disciplineRepo.find({ order: { order: "ASC" } });
    }
    async getQuestsWithStatus(userId) {
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
        const questsByDiscipline = {};
        for (const q of allQuests) {
            const key = q.discipline.id;
            if (!questsByDiscipline[key])
                questsByDiscipline[key] = [];
            questsByDiscipline[key].push(q);
        }
        return allQuests.map((q) => {
            const prog = progressByQuestId.get(q.id);
            let status;
            let score = null;
            if (prog) {
                status = prog.status;
                score = prog.score;
            }
            else if (q.orderInDiscipline === 1) {
                status = "available";
            }
            else {
                const disciplineQuests = questsByDiscipline[q.discipline.id] ?? [];
                const prev = disciplineQuests.find((dq) => dq.orderInDiscipline === q.orderInDiscipline - 1);
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
    async getQuestById(id, userId) {
        const quest = await this.questRepo.findOne({
            where: { id, isActive: true },
            relations: ["discipline", "options"],
        });
        if (!quest)
            throw new common_1.NotFoundException("Quest nije pronađen.");
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
    async submitAnswer(userId, dto) {
        const quest = await this.questRepo.findOne({
            where: { id: dto.questId, isActive: true },
            relations: ["discipline", "options"],
        });
        if (!quest)
            throw new common_1.NotFoundException("Quest nije pronađen.");
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ["questProgress", "userBadges", "userBadges.badge"],
        });
        if (!user)
            throw new common_1.NotFoundException("Korisnik nije pronađen.");
        const selectedOption = quest.options.find((o) => o.id === dto.optionId);
        if (!selectedOption)
            throw new common_1.NotFoundException("Opcija nije pronađena.");
        const correctOption = quest.options.find((o) => o.isCorrect);
        const isCorrect = selectedOption.isCorrect;
        const usedHint = dto.usedHint ?? false;
        let score = 0;
        if (isCorrect) {
            score = quest.basePoints;
            if (!usedHint)
                score += 25;
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
                }
                else if (user.lastActivity !== today) {
                    user.streak = 1;
                }
            }
            else {
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
    async checkAndAwardBadges(user, quest, isCorrect, usedHint) {
        const earnedBadges = [];
        const existingBadgeSlugs = new Set(user.userBadges?.map((ub) => ub.badge.slug) ?? []);
        const allBadges = await this.badgeRepo.find();
        const allProgress = await this.progressRepo.find({
            where: { user: { id: user.id } },
            relations: ["quest", "quest.discipline"],
        });
        for (const badge of allBadges) {
            if (existingBadgeSlugs.has(badge.slug))
                continue;
            let earned = false;
            if (badge.conditionType === "no_hint" && isCorrect && !usedHint) {
                earned = true;
            }
            else if (badge.conditionType === "perfect_score" && isCorrect && !usedHint) {
                earned = true;
            }
            else if (badge.conditionType === "discipline_complete" && badge.conditionValue) {
                const disciplineProgress = allProgress.filter((p) => p.quest.discipline?.slug === badge.conditionValue);
                const allQuestsInDiscipline = await this.questRepo.find({
                    where: { discipline: { slug: badge.conditionValue }, isActive: true },
                });
                if (allQuestsInDiscipline.length > 0 &&
                    disciplineProgress.length >= allQuestsInDiscipline.length) {
                    earned = true;
                }
            }
            else if (badge.conditionType === "all_complete") {
                const allActiveQuests = await this.questRepo.find({ where: { isActive: true } });
                if (allProgress.length >= allActiveQuests.length) {
                    earned = true;
                }
            }
            else if (badge.conditionType === "quests_count" && badge.conditionValue) {
                const required = parseInt(badge.conditionValue, 10);
                if (allProgress.length >= required)
                    earned = true;
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
};
exports.QuestsService = QuestsService;
exports.QuestsService = QuestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quest_entity_1.Quest)),
    __param(1, (0, typeorm_1.InjectRepository)(quest_option_entity_1.QuestOption)),
    __param(2, (0, typeorm_1.InjectRepository)(discipline_entity_1.Discipline)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(user_quest_progress_entity_1.UserQuestProgress)),
    __param(5, (0, typeorm_1.InjectRepository)(badge_entity_1.Badge)),
    __param(6, (0, typeorm_1.InjectRepository)(user_badge_entity_1.UserBadge)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuestsService);
//# sourceMappingURL=quests.service.js.map