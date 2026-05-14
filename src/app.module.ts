import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ContentModule } from "./content/content.module";
import { ProgressModule } from "./progress/progress.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [HealthModule, ContentModule, AuthModule, ProgressModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
