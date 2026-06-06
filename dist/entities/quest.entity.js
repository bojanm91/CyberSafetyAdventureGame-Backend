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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quest = void 0;
const typeorm_1 = require("typeorm");
const discipline_entity_1 = require("./discipline.entity");
const quest_option_entity_1 = require("./quest-option.entity");
const user_quest_progress_entity_1 = require("./user-quest-progress.entity");
let Quest = class Quest {
    id;
    discipline;
    title;
    difficulty;
    basePoints;
    scenario;
    taskText;
    hintText;
    feedbackCorrect;
    miniConclusion;
    questType;
    orderInDiscipline;
    isActive;
    options;
    progress;
};
exports.Quest = Quest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Quest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => discipline_entity_1.Discipline, (d) => d.quests, { eager: false }),
    __metadata("design:type", discipline_entity_1.Discipline)
], Quest.prototype, "discipline", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Quest.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10 }),
    __metadata("design:type", String)
], Quest.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 50 }),
    __metadata("design:type", Number)
], Quest.prototype, "basePoints", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Quest.prototype, "scenario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Quest.prototype, "taskText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Quest.prototype, "hintText", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Quest.prototype, "feedbackCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Quest.prototype, "miniConclusion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], Quest.prototype, "questType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Quest.prototype, "orderInDiscipline", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Quest.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quest_option_entity_1.QuestOption, (o) => o.quest, { eager: true }),
    __metadata("design:type", Array)
], Quest.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_quest_progress_entity_1.UserQuestProgress, (p) => p.quest),
    __metadata("design:type", Array)
], Quest.prototype, "progress", void 0);
exports.Quest = Quest = __decorate([
    (0, typeorm_1.Entity)("quests")
], Quest);
//# sourceMappingURL=quest.entity.js.map