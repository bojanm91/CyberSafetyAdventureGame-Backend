import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quest } from "./quest.entity";

@Entity("disciplines")
export class Discipline {
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

  @Column()
  colorClass: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => Quest, (q) => q.discipline)
  quests: Quest[];
}
