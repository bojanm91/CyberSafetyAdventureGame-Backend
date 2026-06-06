import { ProgressService } from "./progress.service";
import { User } from "../entities/user.entity";
interface AuthRequest extends Request {
    user: User;
}
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getMe(req: AuthRequest): Promise<{
        profile: {
            id: string;
            username: string;
            email: string;
            status: string;
            level: number;
            points: number;
            streak: number;
        };
        stats: {
            xpPercentage: number;
            xpToNextLevel: number;
            completedQuests: number;
            totalQuests: number;
            badgesCount: number;
        };
        badges: {
            id: string;
            name: string;
            icon: string;
            description: string;
            earnedAt: Date;
        }[];
        disciplineStats: Record<string, {
            total: number;
            completed: number;
            points: number;
        }>;
        nextRecommended: {
            id: string;
            title: string;
            discipline: string;
        } | null;
    }>;
}
export {};
