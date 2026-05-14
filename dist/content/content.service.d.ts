export declare class ContentService {
    getLandingContent(): {
        title: string;
        hero: {
            eyebrow: string;
            title: string;
            description: string;
        };
        features: string[];
        howItWorks: {
            number: string;
            title: string;
            text: string;
            icon: string;
        }[];
        disciplines: {
            category: string;
            title: string;
            text: string;
            icon: string;
        }[];
    };
    getMissions(): {
        id: string;
        discipline: string;
        title: string;
        difficulty: string;
        points: number;
        status: string;
        summary: string;
    }[];
    getDashboard(): {
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
        dashboardPreview: {
            title: string;
            text: string;
            label: string;
        }[];
    };
}
