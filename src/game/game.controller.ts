import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GameService } from "./game.service";
import { SubmitResultDto } from "./dto/submit-result.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";

@Controller("game")
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get("topics")
  @UseGuards(JwtAuthGuard)
  getTopics() {
    return this.gameService.getTopics();
  }

  @Get("scenarios")
  @UseGuards(JwtAuthGuard)
  getScenarios(@Req() req: any, @Query("topic") topic?: string) {
    return this.gameService.getScenarios(topic, req.user.sub);
  }

  @Get("scenarios/:id")
  @UseGuards(JwtAuthGuard)
  getScenario(@Param("id") id: string) {
    return this.gameService.getScenario(id);
  }

  @Post("results")
  @UseGuards(JwtAuthGuard)
  submitResult(@Req() req: any, @Body() dto: SubmitResultDto) {
    return this.gameService.submitResult(req.user.sub, dto);
  }

  @Get("leaderboard")
  @UseGuards(JwtAuthGuard)
  getLeaderboard() {
    return this.gameService.getLeaderboard();
  }

  @Patch("avatar")
  @UseGuards(JwtAuthGuard)
  updateAvatar(@Req() req: any, @Body() dto: UpdateAvatarDto) {
    return this.gameService.updateAvatar(req.user.sub, dto);
  }

  @Get("daily-challenge")
  @UseGuards(JwtAuthGuard)
  getDailyChallenge() {
    return this.gameService.getDailyChallenge();
  }

  @Get("mastery")
  @UseGuards(JwtAuthGuard)
  getMastery(@Req() req: any) {
    return this.gameService.getMastery(req.user.sub);
  }

  @Get("xp-history")
  @UseGuards(JwtAuthGuard)
  getXpHistory(@Req() req: any) {
    return this.gameService.getXpHistory(req.user.sub);
  }
}
