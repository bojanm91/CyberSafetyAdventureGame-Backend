import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class SubmitResultDto {
  @IsString()
  questId: string;

  @IsBoolean()
  correct: boolean;

  @IsNumber()
  xpEarned: number;

  @IsNumber()
  @IsOptional()
  timeMs?: number;
}
