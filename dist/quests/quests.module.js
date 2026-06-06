"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quest_entity_1 = require("../entities/quest.entity");
const quest_option_entity_1 = require("../entities/quest-option.entity");
const discipline_entity_1 = require("../entities/discipline.entity");
const user_entity_1 = require("../entities/user.entity");
const user_quest_progress_entity_1 = require("../entities/user-quest-progress.entity");
const badge_entity_1 = require("../entities/badge.entity");
const user_badge_entity_1 = require("../entities/user-badge.entity");
const quests_controller_1 = require("./quests.controller");
const quests_service_1 = require("./quests.service");
let QuestsModule = class QuestsModule {
};
exports.QuestsModule = QuestsModule;
exports.QuestsModule = QuestsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                quest_entity_1.Quest,
                quest_option_entity_1.QuestOption,
                discipline_entity_1.Discipline,
                user_entity_1.User,
                user_quest_progress_entity_1.UserQuestProgress,
                badge_entity_1.Badge,
                user_badge_entity_1.UserBadge,
            ]),
        ],
        controllers: [quests_controller_1.QuestsController],
        providers: [quests_service_1.QuestsService],
    })
], QuestsModule);
//# sourceMappingURL=quests.module.js.map