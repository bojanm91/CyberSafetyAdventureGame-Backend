"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const content_module_1 = require("./content/content.module");
const progress_module_1 = require("./progress/progress.module");
const health_module_1 = require("./health/health.module");
const quests_module_1 = require("./quests/quests.module");
const seed_module_1 = require("./seed/seed.module");
const game_module_1 = require("./game/game.module");
const user_entity_1 = require("./entities/user.entity");
const discipline_entity_1 = require("./entities/discipline.entity");
const quest_entity_1 = require("./entities/quest.entity");
const quest_option_entity_1 = require("./entities/quest-option.entity");
const user_quest_progress_entity_1 = require("./entities/user-quest-progress.entity");
const badge_entity_1 = require("./entities/badge.entity");
const user_badge_entity_1 = require("./entities/user-badge.entity");
const result_entity_1 = require("./entities/result.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                url: process.env.DATABASE_URL,
                entities: [user_entity_1.User, discipline_entity_1.Discipline, quest_entity_1.Quest, quest_option_entity_1.QuestOption, user_quest_progress_entity_1.UserQuestProgress, badge_entity_1.Badge, user_badge_entity_1.UserBadge, result_entity_1.Result],
                synchronize: true,
            }),
            health_module_1.HealthModule,
            content_module_1.ContentModule,
            auth_module_1.AuthModule,
            progress_module_1.ProgressModule,
            quests_module_1.QuestsModule,
            seed_module_1.SeedModule,
            game_module_1.GameModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map