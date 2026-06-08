import { Discipline } from "./discipline.entity";
import { QuestOption } from "./quest-option.entity";
import { UserQuestProgress } from "./user-quest-progress.entity";
export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestType = "multiple_choice" | "risk_assessment" | "spot_danger" | "decision";
export type InteractionType = "odluka" | "phishing_inbox" | "lozinka" | "razvrstaj" | "pravo_lazno" | "razgovor" | "podesi" | "brzi_krug";
export declare class Quest {
    id: string;
    discipline: Discipline;
    title: string;
    difficulty: QuestDifficulty;
    basePoints: number;
    scenario: string;
    taskText: string;
    hintText: string;
    feedbackCorrect: string;
    miniConclusion: string;
    questType: QuestType;
    orderInDiscipline: number;
    isActive: boolean;
    interactionType: InteractionType | null;
    gameData: Record<string, unknown> | null;
    correctData: Record<string, unknown> | null;
    objasnjenje: string | null;
    xp: number;
    options: QuestOption[];
    progress: UserQuestProgress[];
}
