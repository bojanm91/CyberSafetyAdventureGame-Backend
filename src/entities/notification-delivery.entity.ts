import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { User } from "./user.entity";

export type NotificationKind = "daily_challenge" | "comeback";

@Entity("notification_deliveries")
@Unique(["userId", "kind", "dateKey"])
export class NotificationDelivery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: string;

  @Column({ type: "varchar", length: 40 })
  kind: NotificationKind;

  @Column({ type: "varchar", length: 10 })
  dateKey: string;

  @Column({ default: 0 })
  sentCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
