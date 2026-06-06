import { UserBadge } from "./user-badge.entity";
export type BadgeConditionType = "discipline_complete" | "no_hint" | "perfect_score" | "quests_count" | "all_complete";
export declare class Badge {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    conditionType: BadgeConditionType;
    conditionValue: string | null;
    userBadges: UserBadge[];
}
