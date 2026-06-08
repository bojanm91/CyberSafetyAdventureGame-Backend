import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GameService } from "./game.service";
import { SubmitResultDto } from "./dto/submit-result.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";
import { User } from "../entities/user.entity";

interface AuthRequest extends Request {
  user: User;
}

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
  getScenarios(@Request() req: AuthRequest, @Query("topic") topic?: string) {
    return this.gameService.getScenarios(topic, req.user.id);
  }

  @Get("scenarios/:id")
  @UseGuards(JwtAuthGuard)
  getScenario(@Param("id") id: string) {
    return this.gameService.getScenario(id);
  }

  @Post("results")
  @UseGuards(JwtAuthGuard)
  submitResult(@Request() req: AuthRequest, @Body() dto: SubmitResultDto) {
    return this.gameService.submitResult(req.user.id, dto);
  }

  @Get("leaderboard")
  @UseGuards(JwtAuthGuard)
  getLeaderboard() {
    return this.gameService.getLeaderboard();
  }

  @Patch("avatar")
  @UseGuards(JwtAuthGuard)
  updateAvatar(@Request() req: AuthRequest, @Body() dto: UpdateAvatarDto) {
    return this.gameService.updateAvatar(req.user.id, dto);
  }

  @Get("daily-challenge")
  @UseGuards(JwtAuthGuard)
  getDailyChallenge() {
    return this.gameService.getDailyChallenge();
  }

  @Get("mastery")
  @UseGuards(JwtAuthGuard)
  getMastery(@Request() req: AuthRequest) {
    return this.gameService.getMastery(req.user.id);
  }

  @Get("xp-history")
  @UseGuards(JwtAuthGuard)
  getXpHistory(@Request() req: AuthRequest) {
    return this.gameService.getXpHistory(req.user.id);
  }

  @Get("byte-fact")
  @UseGuards(JwtAuthGuard)
  getByteFact() {
    return this.gameService.getByteFact();
  }
}
