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
        const disciplineCount = await this.disciplineRepo.count();
        if (disciplineCount === 0) {
            this.logger.log("Pokretanje seed-a (stari quests)...");
            await this.seedLegacy();
            this.logger.log("Legacy seed završen.");
        }
        else {
            this.logger.log("Legacy podaci već postoje - preskačem.");
        }
        await this.seedGameTopics();
        await this.seedAllBadges();
    }
    async seedLegacy() {
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
                await this.optionRepo.save(this.optionRepo.create({ quest: savedQuest, ...opt }));
            }
        }
    }
    async seedGameTopics() {
        for (const topicData of seed_data_1.GAME_TOPICS_DATA) {
            let discipline = await this.disciplineRepo.findOneBy({ slug: topicData.slug });
            if (!discipline) {
                discipline = await this.disciplineRepo.save(this.disciplineRepo.create({
                    slug: topicData.slug,
                    name: topicData.name,
                    description: topicData.opis,
                    icon: topicData.ikona,
                    colorClass: topicData.colorClass,
                    order: topicData.order,
                    lekcija: topicData.lekcija,
                }));
                this.logger.log(`Kreirana disciplina: ${topicData.slug}`);
            }
            else if (!discipline.lekcija) {
                discipline.lekcija = topicData.lekcija;
                await this.disciplineRepo.save(discipline);
            }
            const scenarios = seed_data_1.SCENARIOS_DATA.filter((s) => s.topicSlug === topicData.slug);
            for (const s of scenarios) {
                const existing = await this.questRepo.findOneBy({ title: s.title, interactionType: s.interactionType });
                if (existing)
                    continue;
                await this.questRepo.save(this.questRepo.create({
                    discipline,
                    title: s.title,
                    difficulty: s.difficulty,
                    basePoints: s.xp,
                    xp: s.xp,
                    questType: "multiple_choice",
                    orderInDiscipline: s.order,
                    scenario: s.tekst,
                    taskText: s.tekst,
                    hintText: s.hint ?? "",
                    feedbackCorrect: s.objasnjenje,
                    miniConclusion: s.objasnjenje.slice(0, 120),
                    interactionType: s.interactionType,
                    gameData: s.gameData,
                    correctData: s.correctData,
                    objasnjenje: s.objasnjenje,
                    isActive: true,
                }));
                this.logger.log(`Kreiran scenario: ${s.title}`);
            }
        }
    }
    async seedAllBadges() {
        const allBadgeSlugs = [...seed_data_1.BADGES_DATA, ...seed_data_1.GAME_BADGES_DATA];
        for (const b of allBadgeSlugs) {
            const exists = await this.badgeRepo.findOneBy({ slug: b.slug });
            if (!exists) {
                await this.badgeRepo.save(this.badgeRepo.create(b));
            }
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