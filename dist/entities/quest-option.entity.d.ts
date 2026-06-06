import { Quest } from "./quest.entity";
export declare class QuestOption {
    id: string;
    quest: Quest;
    text: string;
    isCorrect: boolean;
    explanation: string | null;
    order: number;
}
