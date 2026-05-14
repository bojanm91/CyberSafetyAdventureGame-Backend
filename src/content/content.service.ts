import { Injectable } from "@nestjs/common";
import {
  dashboardPreview,
  disciplines,
  howItWorks,
  landingFeatures,
  missions,
  userProgress,
} from "./content.constants";

@Injectable()
export class ContentService {
  getLandingContent() {
    return {
      title: "Cyber Safety Adventure",
      hero: {
        eyebrow: "Nova edukativna cyber avantura",
        title: "Postani cyber agent i nauči kako da se zaštitiš online.",
        description:
          "Rješavaj realne cyber scenarije, prepoznaj phishing, zaštiti naloge, osvajaj bodove i napreduj kroz digitalnu avanturu.",
      },
      features: landingFeatures,
      howItWorks,
      disciplines,
    };
  }

  getMissions() {
    return missions;
  }

  getDashboard() {
    return {
      profile: userProgress.profile,
      stats: userProgress.stats,
      recommended: userProgress.recommended,
      dailyChallenge: userProgress.dailyChallenge,
      dashboardPreview,
    };
  }
}
