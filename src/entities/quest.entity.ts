import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Discipline } from "./discipline.entity";
import { QuestOption } from "./quest-option.entity";
import { UserQuestProgress } from "./user-quest-progress.entity";

export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestType =
  | "multiple_choice"
  | "risk_assessment"
  | "spot_danger"
  | "decision";

export type InteractionType =
  | "odluka"
  | "phishing_inbox"
  | "lozinka"
  | "razvrstaj"
  | "pravo_lazno"
  | "razgovor"
  | "podesi"
  | "brzi_krug";

@Entity("quests")
export class Quest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Discipline, (d) => d.quests, { eager: false })
  discipline: Discipline;

  @Column()
  title: string;

  @Column({ type: "varchar", length: 10 })
  difficulty: QuestDifficulty;

  @Column({ default: 50 })
  basePoints: number;

  @Column({ type: "text" })
  scenario: string;

  @Column({ type: "text" })
  taskText: string;

  @Column({ type: "text" })
  hintText: string;

  @Column({ type: "text" })
  feedbackCorrect: string;

  @Column({ type: "text" })
  miniConclusion: string;

  @Column({ type: "varchar", length: 20 })
  questType: QuestType;

  @Column({ default: 1 })
  orderInDiscipline: number;

  @Column({ default: true })
  isActive: boolean;

  // New interaction system fields
  @Column({ type: "varchar", length: 30, nullable: true })
  interactionType: InteractionType | null;

  @Column({ type: "json", nullable: true })
  gameData: Record<string, unknown> | null;

  @Column({ type: "json", nullable: true })
  correctData: Record<string, unknown> | null;

  @Column({ type: "text", nullable: true })
  objasnjenje: string | null;

  @Column({ default: 0 })
  xp: number;

  @OneToMany(() => QuestOption, (o) => o.quest, { eager: true })
  options: QuestOption[];

  @OneToMany(() => UserQuestProgress, (p) => p.quest)
  progress: UserQuestProgress[];
}
