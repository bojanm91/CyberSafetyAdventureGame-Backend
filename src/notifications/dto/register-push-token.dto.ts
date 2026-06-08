import { IsIn, IsOptional, IsString, Matches } from "class-validator";

export class RegisterPushTokenDto {
  @IsString()
  @Matches(/^(Expo|Exponent)PushToken\[[A-Za-z0-9_-]+\]$/)
  token: string;

  @IsOptional()
  @IsIn(["ios", "android", "web", "unknown"])
  platform?: "ios" | "android" | "web" | "unknown";
}
