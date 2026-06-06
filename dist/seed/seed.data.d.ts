export declare const DISCIPLINES_DATA: {
    name: string;
    slug: string;
    description: string;
    icon: string;
    colorClass: string;
    order: number;
}[];
export declare const QUESTS_DATA: ({
    disciplineSlug: string;
    title: string;
    difficulty: "easy";
    basePoints: number;
    questType: "multiple_choice";
    orderInDiscipline: number;
    scenario: string;
    taskText: string;
    hintText: string;
    feedbackCorrect: string;
    miniConclusion: string;
    options: {
        text: string;
        isCorrect: boolean;
        explanation: string;
        order: number;
    }[];
} | {
    disciplineSlug: string;
    title: string;
    difficulty: "medium";
    basePoints: number;
    questType: "decision";
    orderInDiscipline: number;
    scenario: string;
    taskText: string;
    hintText: string;
    feedbackCorrect: string;
    miniConclusion: string;
    options: {
        text: string;
        isCorrect: boolean;
        explanation: string;
        order: number;
    }[];
} | {
    disciplineSlug: string;
    title: string;
    difficulty: "medium";
    basePoints: number;
    questType: "spot_danger";
    orderInDiscipline: number;
    scenario: string;
    taskText: string;
    hintText: string;
    feedbackCorrect: string;
    miniConclusion: string;
    options: {
        text: string;
        isCorrect: boolean;
        explanation: string;
        order: number;
    }[];
} | {
    disciplineSlug: string;
    title: string;
    difficulty: "easy";
    basePoints: number;
    questType: "risk_assessment";
    orderInDiscipline: number;
    scenario: string;
    taskText: string;
    hintText: string;
    feedbackCorrect: string;
    miniConclusion: string;
    options: {
        text: string;
        isCorrect: boolean;
        explanation: string;
        order: number;
    }[];
} | {
    disciplineSlug: string;
    title: string;
    difficulty: "easy";
    basePoints: number;
    questType: "decision";
    orderInDiscipline: number;
    scenario: string;
    taskText: string;
    hintText: string;
    feedbackCorrect: string;
    miniConclusion: string;
    options: {
        text: string;
        isCorrect: boolean;
        explanation: string;
        order: number;
    }[];
} | {
    disciplineSlug: string;
    title: string;
    difficulty: "hard";
    basePoints: number;
    questType: "decision";
    orderInDiscipline: number;
    scenario: string;
    taskText: string;
    hintText: string;
    feedbackCorrect: string;
    miniConclusion: string;
    options: {
        text: string;
        isCorrect: boolean;
        explanation: string;
        order: number;
    }[];
})[];
export declare const BADGES_DATA: ({
    name: string;
    slug: string;
    description: string;
    icon: string;
    conditionType: "discipline_complete";
    conditionValue: string;
} | {
    name: string;
    slug: string;
    description: string;
    icon: string;
    conditionType: "no_hint";
    conditionValue: null;
} | {
    name: string;
    slug: string;
    description: string;
    icon: string;
    conditionType: "perfect_score";
    conditionValue: null;
} | {
    name: string;
    slug: string;
    description: string;
    icon: string;
    conditionType: "all_complete";
    conditionValue: null;
} | {
    name: string;
    slug: string;
    description: string;
    icon: string;
    conditionType: "quests_count";
    conditionValue: string;
})[];
