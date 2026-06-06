import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Quest } from "./quest.entity";

@Entity("quest_options")
export class QuestOption {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Quest, (q) => q.options)
  quest: Quest;

  @Column({ type: "text" })
  text: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ type: "text", nullable: true })
  explanation: string | null;

  @Column({ default: 0 })
  order: number;
}
