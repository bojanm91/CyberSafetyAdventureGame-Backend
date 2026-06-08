import { Quest } from "./quest.entity";
export declare class Discipline {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    colorClass: string;
    lekcija: string | null;
    order: number;
    quests: Quest[];
}
