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
    codename: string | null;
    avatarBase: string | null;
    avatarColor: string | null;
    avatarGear: string | null;
    onboardingDone: boolean;
    createdAt: Date;
    questProgress: UserQuestProgress[];
    userBadges: UserBadge[];
}
