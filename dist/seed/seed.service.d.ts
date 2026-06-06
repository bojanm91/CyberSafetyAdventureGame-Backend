import { OnApplicationBootstrap } from "@nestjs/common";
import { Repository } from "typeorm";
import { Discipline } from "../entities/discipline.entity";
import { Quest } from "../entities/quest.entity";
import { QuestOption } from "../entities/quest-option.entity";
import { Badge } from "../entities/badge.entity";
export declare class SeedService implements OnApplicationBootstrap {
    private readonly disciplineRepo;
    private readonly questRepo;
    private readonly optionRepo;
    private readonly badgeRepo;
    private readonly logger;
    constructor(disciplineRepo: Repository<Discipline>, questRepo: Repository<Quest>, optionRepo: Repository<QuestOption>, badgeRepo: Repository<Badge>);
    onApplicationBootstrap(): Promise<void>;
    private seed;
}
