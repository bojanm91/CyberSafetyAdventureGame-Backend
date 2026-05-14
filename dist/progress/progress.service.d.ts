export declare class ProgressService {
    getMe(): {
        nextMission: {
            id: string;
            discipline: string;
            title: string;
            difficulty: string;
            points: number;
            status: string;
            summary: string;
        };
        dashboardPreview: {
            title: string;
            text: string;
            label: string;
        }[];
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
}
