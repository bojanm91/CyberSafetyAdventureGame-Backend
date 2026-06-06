import { QuestsService } from "./quests.service";
import { SubmitAnswerDto } from "./dto/submit-answer.dto";
import { User } from "../entities/user.entity";
interface AuthRequest extends Request {
    user: User;
}
export declare class QuestsController {
    private readonly questsService;
    constructor(questsService: QuestsService);
    getDisciplines(): Promise<import("../entities/discipline.entity").Discipline[]>;
    getAll(req: AuthRequest): Promise<{
        id: string;
        title: string;
        difficulty: import("../entities/quest.entity").QuestDifficulty;
        basePoints: number;
        questType: import("../entities/quest.entity").QuestType;
        orderInDiscipline: number;
        discipline: {
            id: string;
            name: string;
            slug: string;
            icon: string;
            colorClass: string;
        };
        status: string;
        score: number | null;
    }[]>;
    getOne(id: string, req: AuthRequest): Promise<{
        id: string;
        title: string;
        difficulty: import("../entities/quest.entity").QuestDifficulty;
        basePoints: number;
        questType: import("../entities/quest.entity").QuestType;
        scenario: string;
        taskText: string;
        hintText: string;
        miniConclusion: string;
        discipline: {
            id: string;
            name: string;
            slug: string;
            icon: string;
        };
        options: {
            id: string;
            text: string;
            order: number;
        }[];
        userProgress: {
            status: import("../entities/user-quest-progress.entity").QuestStatus;
            score: number;
            usedHint: boolean;
            correctOptionId: string | null;
        } | null;
    }>;
    submit(req: AuthRequest, dto: SubmitAnswerDto): Promise<{
        correct: boolean;
        score: number;
        correctOptionId: string | null;
        feedbackCorrect: string;
        miniConclusion: string;
        selectedOptionExplanation: string | null;
        earnedBadges: {
            name: string;
            icon: string;
        }[];
        user: {
            points: number;
            level: number;
            status: string;
            streak: number;
        };
    }>;
}
export {};
