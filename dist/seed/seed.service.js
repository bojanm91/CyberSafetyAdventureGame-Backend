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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const discipline_entity_1 = require("../entities/discipline.entity");
const quest_entity_1 = require("../entities/quest.entity");
const quest_option_entity_1 = require("../entities/quest-option.entity");
const badge_entity_1 = require("../entities/badge.entity");
const seed_data_1 = require("./seed.data");
let SeedService = SeedService_1 = class SeedService {
    disciplineRepo;
    questRepo;
    optionRepo;
    badgeRepo;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(disciplineRepo, questRepo, optionRepo, badgeRepo) {
        this.disciplineRepo = disciplineRepo;
        this.questRepo = questRepo;
        this.optionRepo = optionRepo;
        this.badgeRepo = badgeRepo;
    }
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
    async seed() {
        const disciplineMap = new Map();
        for (const d of seed_data_1.DISCIPLINES_DATA) {
            const disc = this.disciplineRepo.create(d);
            const saved = await this.disciplineRepo.save(disc);
            disciplineMap.set(d.slug, saved);
        }
        for (const q of seed_data_1.QUESTS_DATA) {
            const discipline = disciplineMap.get(q.disciplineSlug);
            if (!discipline)
                continue;
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
        for (const b of seed_data_1.BADGES_DATA) {
            const badge = this.badgeRepo.create(b);
            await this.badgeRepo.save(badge);
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(discipline_entity_1.Discipline)),
    __param(1, (0, typeorm_1.InjectRepository)(quest_entity_1.Quest)),
    __param(2, (0, typeorm_1.InjectRepository)(quest_option_entity_1.QuestOption)),
    __param(3, (0, typeorm_1.InjectRepository)(badge_entity_1.Badge)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map