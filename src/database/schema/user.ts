import { Expense } from "@/database/schema/expense";
import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

enum UserRole {
	ADMIN = "admin",
	USER = "user",
}

@Entity()
class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", name: "first_name", length: 255 })
	firstName: string;

	@Column({ type: "varchar", name: "last_name", length: 255 })
	lastName: string;

	@Column({ type: "varchar", name: "email", length: 255, unique: false })
	email: string;

	@Column({ type: "varchar", name: "password" })
	password: string;

	@Column({
		type: "enum",
		name: "role",
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

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

	@OneToMany(
		() => Expense,
		(expense: Expense) => expense.user,
		{
			cascade: true,
		},
	)
	expenses: Expense[];
}

export { User, UserRole };
