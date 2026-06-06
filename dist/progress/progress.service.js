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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_quest_progress_entity_1 = require("../entities/user-quest-progress.entity");
const user_badge_entity_1 = require("../entities/user-badge.entity");
const quest_entity_1 = require("../entities/quest.entity");
let ProgressService = class ProgressService {
    userRepo;
    progressRepo;
    userBadgeRepo;
    questRepo;
    constructor(userRepo, progressRepo, userBadgeRepo, questRepo) {
        this.userRepo = userRepo;
        this.progressRepo = progressRepo;
        this.userBadgeRepo = userBadgeRepo;
        this.questRepo = questRepo;
    }
    async getMe(userId) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException("Korisnik nije pronađen.");
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
        const disciplineStats = {};
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
    async findNextRecommended(userId, progressRecords) {
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
                const disciplineQuests = allQuests.filter((dq) => dq.discipline.id === q.discipline.id);
                const prev = disciplineQuests.find((dq) => dq.orderInDiscipline === q.orderInDiscipline - 1);
                if (prev && completedIds.has(prev.id)) {
                    return { id: q.id, title: q.title, discipline: q.discipline.name };
                }
            }
        }
        return null;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_quest_progress_entity_1.UserQuestProgress)),
    __param(2, (0, typeorm_1.InjectRepository)(user_badge_entity_1.UserBadge)),
    __param(3, (0, typeorm_1.InjectRepository)(quest_entity_1.Quest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProgressService);
//# sourceMappingURL=progress.service.js.map