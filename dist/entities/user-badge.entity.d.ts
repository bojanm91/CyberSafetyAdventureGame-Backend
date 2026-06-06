import { User } from "./user.entity";
import { Badge } from "./badge.entity";
export declare class UserBadge {
    id: string;
    user: User;
    badge: Badge;
    earnedAt: Date;
}
