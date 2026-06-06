import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { QuestsService } from "./quests.service";
import { SubmitAnswerDto } from "./dto/submit-answer.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User } from "../entities/user.entity";

interface AuthRequest extends Request {
  user: User;
}

@Controller("quests")
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get("disciplines")
  getDisciplines() {
    return this.questsService.getDisciplines();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Request() req: AuthRequest) {
    return this.questsService.getQuestsWithStatus(req.user.id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getOne(@Param("id") id: string, @Request() req: AuthRequest) {
    return this.questsService.getQuestById(id, req.user.id);
  }

  @Post("submit")
  @UseGuards(JwtAuthGuard)
  submit(@Request() req: AuthRequest, @Body() dto: SubmitAnswerDto) {
    return this.questsService.submitAnswer(req.user.id, dto);
  }
}
