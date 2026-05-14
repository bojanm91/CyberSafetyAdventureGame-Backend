export declare const landingFeatures: string[];
export declare const howItWorks: {
    number: string;
    title: string;
    text: string;
    icon: string;
}[];
export declare const disciplines: {
    category: string;
    title: string;
    text: string;
    icon: string;
}[];
export declare const dashboardPreview: {
    title: string;
    text: string;
    label: string;
}[];
export declare const missions: {
    id: string;
    discipline: string;
    title: string;
    difficulty: string;
    points: number;
    status: string;
    summary: string;
}[];
export declare const userProgress: {
    profile: {
        username: string;
        status: string;
        level: number;
        streak: number;
    };
    stats: {
        points: number;
        xpToNextLevel: number;
        badges: number;
    };
    recommended: {
        title: string;
        summary: string;
    };
    dailyChallenge: {
        title: string;
        summary: string;
    };
};
