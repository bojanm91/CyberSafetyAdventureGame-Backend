import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserQuestProgress } from "./user-quest-progress.entity";
import { UserBadge } from "./user-badge.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: "Cyber Rookie" })
  status: string;

  @Column({ default: 1 })
  level: number;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  streak: number;

  @Column({ type: "date", nullable: true })
  lastActivity: string | null;

  // Avatar fields
  @Column({ type: "varchar", length: 50, nullable: true })
  codename: string | null;

  @Column({ type: "varchar", length: 5, nullable: true, default: "A" })
  avatarBase: string | null;

  @Column({ type: "varchar", length: 20, nullable: true, default: "#22D3EE" })
  avatarColor: string | null;

  @Column({ type: "varchar", length: 20, nullable: true, default: "none" })
  avatarGear: string | null;

  @Column({ default: false })
  onboardingDone: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => UserQuestProgress, (p) => p.user)
  questProgress: UserQuestProgress[];

  @OneToMany(() => UserBadge, (ub) => ub.user)
  userBadges: UserBadge[];
}
