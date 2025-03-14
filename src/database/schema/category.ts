import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

enum CategoryType {
	SYSTEM = "system",
	USER = "user",
}

@Entity()
class Category {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", name: "name", length: 255 })
	name: string;

	@Column({ type: "varchar", name: "description", length: 255, nullable: true })
	description: string;

	@Column({ type: "enum", enum: CategoryType, name: "type" })
	type: CategoryType;

	@OneToOne(() => User, { nullable: true, cascade: true })
	@JoinColumn()
	user: User;

	@Column({
		type: "timestamp",
		name: "created_at",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date;

	@Column({
		type: "timestamp",
		name: "updated_at",
		default: () => "CURRENT_TIMESTAMP",
	})
	updatedAt: Date;
}

export { Category, CategoryType };
