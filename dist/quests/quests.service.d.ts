import { Repository } from "typeorm";
import { Quest } from "../entities/quest.entity";
import { QuestOption } from "../entities/quest-option.entity";
import { Discipline } from "../entities/discipline.entity";
import { User } from "../entities/user.entity";
import { UserQuestProgress } from "../entities/user-quest-progress.entity";
import { Badge } from "../entities/badge.entity";
import { UserBadge } from "../entities/user-badge.entity";
import { SubmitAnswerDto } from "./dto/submit-answer.dto";
export declare class QuestsService {
    private readonly questRepo;
    private readonly optionRepo;
    private readonly disciplineRepo;
    private readonly userRepo;
    private readonly progressRepo;
    private readonly badgeRepo;
    private readonly userBadgeRepo;
    constructor(questRepo: Repository<Quest>, optionRepo: Repository<QuestOption>, disciplineRepo: Repository<Discipline>, userRepo: Repository<User>, progressRepo: Repository<UserQuestProgress>, badgeRepo: Repository<Badge>, userBadgeRepo: Repository<UserBadge>);
    getDisciplines(): Promise<Discipline[]>;
    getQuestsWithStatus(userId?: string): Promise<{
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
    getQuestById(id: string, userId?: string): Promise<{
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
    submitAnswer(userId: string, dto: SubmitAnswerDto): Promise<{
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
    private checkAndAwardBadges;
}
