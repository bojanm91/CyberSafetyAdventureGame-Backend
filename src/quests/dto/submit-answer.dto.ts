import { IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class SubmitAnswerDto {
  @IsUUID()
  questId: string;

  @IsUUID()
  optionId: string;

  @IsBoolean()
  @IsOptional()
  usedHint?: boolean;
}
