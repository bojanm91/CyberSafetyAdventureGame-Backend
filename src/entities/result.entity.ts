import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Quest } from "./quest.entity";

@Entity("results")
export class Result {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Quest, { onDelete: "SET NULL", nullable: true })
  quest: Quest | null;

  @Column({ nullable: true })
  questId: string | null;

  @Column({ type: "varchar", length: 50, nullable: true })
  disciplineSlug: string | null;

  @Column()
  correct: boolean;

  @Column({ default: 0 })
  xpEarned: number;

  @Column({ nullable: true, type: "int" })
  timeMs: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
