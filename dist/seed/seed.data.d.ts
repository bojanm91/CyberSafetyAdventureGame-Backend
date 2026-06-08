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
export declare const GAME_BADGES_DATA: ({
    name: string;
    slug: string;
    description: string;
    icon: string;
    conditionType: "quests_count";
    conditionValue: string;
} | {
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
    conditionType: "no_hint";
    conditionValue: null;
})[];
export declare const GAME_TOPICS_DATA: {
    slug: string;
    name: string;
    opis: string;
    lekcija: string;
    ikona: string;
    colorClass: string;
    order: number;
}[];
export declare const SCENARIOS_DATA: ({
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        opcije: {
            id: string;
            tekst: string;
        }[];
        kriteriji?: undefined;
        zabranjene?: undefined;
        tip?: undefined;
        uputstvo?: undefined;
        a?: undefined;
        b?: undefined;
        od?: undefined;
        naslov?: undefined;
        tijelo?: undefined;
        link?: undefined;
        zastavice?: undefined;
        vrijemeSekundi?: undefined;
        pitanja?: undefined;
        stavke?: undefined;
        kante?: undefined;
        kontekst?: undefined;
        poruke?: undefined;
    };
    correctData: {
        id: string;
        minScore?: undefined;
        tacno?: undefined;
        ids?: undefined;
        tacni?: undefined;
        sigurno?: undefined;
        rizicno?: undefined;
        ukljuceno?: undefined;
        iskljuceno?: undefined;
        tacnoId?: undefined;
    };
} | {
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        kriteriji: {
            id: string;
            tekst: string;
            regex: string;
        }[];
        zabranjene: string[];
        opcije?: undefined;
        tip?: undefined;
        uputstvo?: undefined;
        a?: undefined;
        b?: undefined;
        od?: undefined;
        naslov?: undefined;
        tijelo?: undefined;
        link?: undefined;
        zastavice?: undefined;
        vrijemeSekundi?: undefined;
        pitanja?: undefined;
        stavke?: undefined;
        kante?: undefined;
        kontekst?: undefined;
        poruke?: undefined;
    };
    correctData: {
        minScore: number;
        id?: undefined;
        tacno?: undefined;
        ids?: undefined;
        tacni?: undefined;
        sigurno?: undefined;
        rizicno?: undefined;
        ukljuceno?: undefined;
        iskljuceno?: undefined;
        tacnoId?: undefined;
    };
} | {
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        tip: string;
        uputstvo: string;
        a: {
            tekst: string;
            oznaka: string;
        };
        b: {
            tekst: string;
            oznaka: string;
        };
        opcije?: undefined;
        kriteriji?: undefined;
        zabranjene?: undefined;
        od?: undefined;
        naslov?: undefined;
        tijelo?: undefined;
        link?: undefined;
        zastavice?: undefined;
        vrijemeSekundi?: undefined;
        pitanja?: undefined;
        stavke?: undefined;
        kante?: undefined;
        kontekst?: undefined;
        poruke?: undefined;
    };
    correctData: {
        tacno: string;
        id?: undefined;
        minScore?: undefined;
        ids?: undefined;
        tacni?: undefined;
        sigurno?: undefined;
        rizicno?: undefined;
        ukljuceno?: undefined;
        iskljuceno?: undefined;
        tacnoId?: undefined;
    };
} | {
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        od: string;
        naslov: string;
        tijelo: string;
        link: string;
        zastavice: {
            id: string;
            tekst: string;
            element: string;
        }[];
        opcije?: undefined;
        kriteriji?: undefined;
        zabranjene?: undefined;
        tip?: undefined;
        uputstvo?: undefined;
        a?: undefined;
        b?: undefined;
        vrijemeSekundi?: undefined;
        pitanja?: undefined;
        stavke?: undefined;
        kante?: undefined;
        kontekst?: undefined;
        poruke?: undefined;
    };
    correctData: {
        ids: string[];
        id?: undefined;
        minScore?: undefined;
        tacno?: undefined;
        tacni?: undefined;
        sigurno?: undefined;
        rizicno?: undefined;
        ukljuceno?: undefined;
        iskljuceno?: undefined;
        tacnoId?: undefined;
    };
} | {
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        vrijemeSekundi: number;
        pitanja: {
            tekst: string;
            opcije: string[];
            tacno: number;
        }[];
        opcije?: undefined;
        kriteriji?: undefined;
        zabranjene?: undefined;
        tip?: undefined;
        uputstvo?: undefined;
        a?: undefined;
        b?: undefined;
        od?: undefined;
        naslov?: undefined;
        tijelo?: undefined;
        link?: undefined;
        zastavice?: undefined;
        stavke?: undefined;
        kante?: undefined;
        kontekst?: undefined;
        poruke?: undefined;
    };
    correctData: {
        tacni: number[];
        id?: undefined;
        minScore?: undefined;
        tacno?: undefined;
        ids?: undefined;
        sigurno?: undefined;
        rizicno?: undefined;
        ukljuceno?: undefined;
        iskljuceno?: undefined;
        tacnoId?: undefined;
    };
} | {
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        stavke: {
            id: string;
            tekst: string;
        }[];
        kante: {
            id: string;
            naziv: string;
        }[];
        opcije?: undefined;
        kriteriji?: undefined;
        zabranjene?: undefined;
        tip?: undefined;
        uputstvo?: undefined;
        a?: undefined;
        b?: undefined;
        od?: undefined;
        naslov?: undefined;
        tijelo?: undefined;
        link?: undefined;
        zastavice?: undefined;
        vrijemeSekundi?: undefined;
        pitanja?: undefined;
        kontekst?: undefined;
        poruke?: undefined;
    };
    correctData: {
        sigurno: string[];
        rizicno: string[];
        id?: undefined;
        minScore?: undefined;
        tacno?: undefined;
        ids?: undefined;
        tacni?: undefined;
        ukljuceno?: undefined;
        iskljuceno?: undefined;
        tacnoId?: undefined;
    };
} | {
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        uputstvo: string;
        opcije: {
            id: string;
            naziv: string;
            opis: string;
            ikona: string;
            tacnoStanje: boolean;
        }[];
        kriteriji?: undefined;
        zabranjene?: undefined;
        tip?: undefined;
        a?: undefined;
        b?: undefined;
        od?: undefined;
        naslov?: undefined;
        tijelo?: undefined;
        link?: undefined;
        zastavice?: undefined;
        vrijemeSekundi?: undefined;
        pitanja?: undefined;
        stavke?: undefined;
        kante?: undefined;
        kontekst?: undefined;
        poruke?: undefined;
    };
    correctData: {
        ukljuceno: string[];
        iskljuceno: string[];
        id?: undefined;
        minScore?: undefined;
        tacno?: undefined;
        ids?: undefined;
        tacni?: undefined;
        sigurno?: undefined;
        rizicno?: undefined;
        tacnoId?: undefined;
    };
} | {
    topicSlug: string;
    title: string;
    interactionType: string;
    difficulty: string;
    xp: number;
    order: number;
    tekst: string;
    hint: string;
    objasnjenje: string;
    gameData: {
        kontekst: string;
        poruke: ({
            od: string;
            tekst: string;
            opcije?: undefined;
        } | {
            od: string;
            opcije: {
                id: string;
                tekst: string;
                tip: string;
            }[];
            tekst?: undefined;
        })[];
        opcije?: undefined;
        kriteriji?: undefined;
        zabranjene?: undefined;
        tip?: undefined;
        uputstvo?: undefined;
        a?: undefined;
        b?: undefined;
        od?: undefined;
        naslov?: undefined;
        tijelo?: undefined;
        link?: undefined;
        zastavice?: undefined;
        vrijemeSekundi?: undefined;
        pitanja?: undefined;
        stavke?: undefined;
        kante?: undefined;
    };
    correctData: {
        tacnoId: string;
        id?: undefined;
        minScore?: undefined;
        tacno?: undefined;
        ids?: undefined;
        tacni?: undefined;
        sigurno?: undefined;
        rizicno?: undefined;
        ukljuceno?: undefined;
        iskljuceno?: undefined;
    };
})[];
