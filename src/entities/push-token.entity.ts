import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

export type PushPlatform = "ios" | "android" | "web" | "unknown";

@Entity("push_tokens")
@Unique(["token"])
export class PushToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  token: string;

  @Column({ type: "varchar", length: 20, default: "unknown" })
  platform: PushPlatform;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
