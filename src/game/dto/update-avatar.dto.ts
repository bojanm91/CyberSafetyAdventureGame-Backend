import { IsOptional, IsString } from "class-validator";

export class UpdateAvatarDto {
  @IsString()
  @IsOptional()
  codename?: string;

  @IsString()
  @IsOptional()
  avatarBase?: string;

  @IsString()
  @IsOptional()
  avatarColor?: string;

  @IsString()
  @IsOptional()
  avatarGear?: string;

  @IsOptional()
  onboardingDone?: boolean;
}
