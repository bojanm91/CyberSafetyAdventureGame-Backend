import { UserQuestProgress } from "./user-quest-progress.entity";
import { UserBadge } from "./user-badge.entity";
export declare class User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    status: string;
    level: number;
    points: number;
    streak: number;
    lastActivity: string | null;
    createdAt: Date;
    questProgress: UserQuestProgress[];
    userBadges: UserBadge[];
}
