import { Quest } from "./quest.entity";
export declare class Discipline {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    colorClass: string;
    order: number;
    quests: Quest[];
}
