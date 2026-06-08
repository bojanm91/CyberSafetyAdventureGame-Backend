import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { Quest } from "../entities/quest.entity";
import { Result } from "../entities/result.entity";
export declare class ProgressService {
    private readonly userRepo;
    private readonly progressRepo;
    private readonly userBadgeRepo;
    private readonly questRepo;
    private readonly resultRepo;
    constructor(userRepo: Repository<User>, progressRepo: Repository<UserQuestProgress>, userBadgeRepo: Repository<UserBadge>, questRepo: Repository<Quest>, resultRepo: Repository<Result>);
    getMe(userId: string): Promise<{
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
    private findNextRecommended;
}
