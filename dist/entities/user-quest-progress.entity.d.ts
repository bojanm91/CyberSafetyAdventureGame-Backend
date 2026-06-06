import { User } from "./user.entity";
import { Quest } from "./quest.entity";
export type QuestStatus = "completed" | "mastered";
export declare class UserQuestProgress {
    id: string;
    user: User;
    quest: Quest;
    status: QuestStatus;
    score: number;
    usedHint: boolean;
    firstTry: boolean;
    completedAt: Date;
}
