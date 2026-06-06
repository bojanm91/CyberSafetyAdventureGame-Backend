import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./user.entity";
import { Quest } from "./quest.entity";

export type QuestStatus = "completed" | "mastered";

@Entity("user_quest_progress")
@Unique(["user", "quest"])
export class UserQuestProgress {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (u) => u.questProgress)
  user: User;

  @ManyToOne(() => Quest, (q) => q.progress)
  quest: Quest;

  @Column({ type: "varchar", length: 20 })
  status: QuestStatus;

  @Column({ default: 0 })
  score: number;

  @Column({ default: false })
  usedHint: boolean;

  @Column({ default: false })
  firstTry: boolean;

  @CreateDateColumn()
  completedAt: Date;
}
