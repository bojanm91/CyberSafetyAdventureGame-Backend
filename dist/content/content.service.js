"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const content_constants_1 = require("./content.constants");
let ContentService = class ContentService {
    getLandingContent() {
        return {
            title: "Cyber Safety Adventure",
            hero: {
                eyebrow: "Nova edukativna cyber avantura",
                title: "Postani cyber agent i nauči kako da se zaštitiš online.",
                description: "Rješavaj realne cyber scenarije, prepoznaj phishing, zaštiti naloge, osvajaj bodove i napreduj kroz digitalnu avanturu.",
            },
            features: content_constants_1.landingFeatures,
            howItWorks: content_constants_1.howItWorks,
            disciplines: content_constants_1.disciplines,
        };
    }
    getMissions() {
        return content_constants_1.missions;
    }
    getDashboard() {
        return {
            profile: content_constants_1.userProgress.profile,
            stats: content_constants_1.userProgress.stats,
            recommended: content_constants_1.userProgress.recommended,
            dailyChallenge: content_constants_1.userProgress.dailyChallenge,
            dashboardPreview: content_constants_1.dashboardPreview,
        };
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)()
], ContentService);
//# sourceMappingURL=content.service.js.map