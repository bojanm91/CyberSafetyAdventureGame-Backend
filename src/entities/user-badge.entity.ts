import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Badge } from "./badge.entity";

@Entity("user_badges")
export class UserBadge {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (u) => u.userBadges)
  user: User;

  @ManyToOne(() => Badge, (b) => b.userBadges, { eager: true })
  badge: Badge;

  @CreateDateColumn()
  earnedAt: Date;
}
