import { Injectable } from "@nestjs/common";
import { dashboardPreview, missions, userProgress } from "../content/content.constants";

@Injectable()
export class ProgressService {
  getMe() {
    return {
      ...userProgress,
      nextMission: missions.find((mission) => mission.status !== "completed") ?? missions[0],
      dashboardPreview,
    };
  }
}
