"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const content_constants_1 = require("../content/content.constants");
let ProgressService = class ProgressService {
    getMe() {
        return {
            ...content_constants_1.userProgress,
            nextMission: content_constants_1.missions.find((mission) => mission.status !== "completed") ?? content_constants_1.missions[0],
            dashboardPreview: content_constants_1.dashboardPreview,
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)()
], ProgressService);
//# sourceMappingURL=progress.service.js.map