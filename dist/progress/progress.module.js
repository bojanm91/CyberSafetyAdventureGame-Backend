"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const user_quest_progress_entity_1 = require("../entities/user-quest-progress.entity");
const user_badge_entity_1 = require("../entities/user-badge.entity");
const quest_entity_1 = require("../entities/quest.entity");
const progress_controller_1 = require("./progress.controller");
const progress_service_1 = require("./progress.service");
let ProgressModule = class ProgressModule {
};
exports.ProgressModule = ProgressModule;
exports.ProgressModule = ProgressModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_quest_progress_entity_1.UserQuestProgress, user_badge_entity_1.UserBadge, quest_entity_1.Quest])],
        controllers: [progress_controller_1.ProgressController],
        providers: [progress_service_1.ProgressService],
    })
], ProgressModule);
//# sourceMappingURL=progress.module.js.map