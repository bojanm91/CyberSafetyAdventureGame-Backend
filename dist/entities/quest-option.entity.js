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
exports.QuestOption = void 0;
const typeorm_1 = require("typeorm");
const quest_entity_1 = require("./quest.entity");
let QuestOption = class QuestOption {
    id;
    quest;
    text;
    isCorrect;
    explanation;
    order;
};
exports.QuestOption = QuestOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], QuestOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quest_entity_1.Quest, (q) => q.options),
    __metadata("design:type", quest_entity_1.Quest)
], QuestOption.prototype, "quest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], QuestOption.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], QuestOption.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", Object)
], QuestOption.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], QuestOption.prototype, "order", void 0);
exports.QuestOption = QuestOption = __decorate([
    (0, typeorm_1.Entity)("quest_options")
], QuestOption);
//# sourceMappingURL=quest-option.entity.js.map