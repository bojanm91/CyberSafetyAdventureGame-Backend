import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getRoot(): {
        name: string;
        version: string;
        status: string;
        docs: string;
    };
}
