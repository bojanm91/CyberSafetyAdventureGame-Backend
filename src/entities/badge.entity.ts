import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserBadge } from "./user-badge.entity";

export type BadgeConditionType =
  | "discipline_complete"
  | "no_hint"
  | "perfect_score"
  | "quests_count"
  | "all_complete";

@Entity("badges")
export class Badge {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: "text" })
  description: string;

  @Column()
  icon: string;

  @Column({ type: "varchar", length: 30 })
  conditionType: BadgeConditionType;

  @Column({ type: "varchar", nullable: true })
  conditionValue: string | null;

  @OneToMany(() => UserBadge, (ub) => ub.badge)
  userBadges: UserBadge[];
}
