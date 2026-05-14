import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getRoot() {
    return {
      name: "Cyber Safety Adventure API",
      version: "0.1.0",
      status: "ok",
      docs: "/api",
    };
  }
}
