import { Controller, Get } from "@nestjs/common";
import { ContentService } from "./content.service";

@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get("landing")
  getLandingContent() {
    return this.contentService.getLandingContent();
  }

  @Get("missions")
  getMissions() {
    return this.contentService.getMissions();
  }

  @Get("dashboard")
  getDashboard() {
    return this.contentService.getDashboard();
  }
}
