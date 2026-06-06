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
exports.UserQuestProgress = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const quest_entity_1 = require("./quest.entity");
let UserQuestProgress = class UserQuestProgress {
    id;
    user;
    quest;
    status;
    score;
    usedHint;
    firstTry;
    completedAt;
};
exports.UserQuestProgress = UserQuestProgress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserQuestProgress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.questProgress),
    __metadata("design:type", user_entity_1.User)
], UserQuestProgress.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quest_entity_1.Quest, (q) => q.progress),
    __metadata("design:type", quest_entity_1.Quest)
], UserQuestProgress.prototype, "quest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20 }),
    __metadata("design:type", String)
], UserQuestProgress.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserQuestProgress.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserQuestProgress.prototype, "usedHint", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserQuestProgress.prototype, "firstTry", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserQuestProgress.prototype, "completedAt", void 0);
exports.UserQuestProgress = UserQuestProgress = __decorate([
    (0, typeorm_1.Entity)("user_quest_progress"),
    (0, typeorm_1.Unique)(["user", "quest"])
], UserQuestProgress);
//# sourceMappingURL=user-quest-progress.entity.js.map