import { Category } from "@/database/schema/category";
import { User } from "@/database/schema/user";
import {
	Column,
	Entity,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";

enum ExpenseType {
	INCOME = "income",
	EXPENSE = "expense",
}

@Entity()
class Expense {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", name: "title", length: 255 })
	title: string;

	@Column({ type: "varchar", name: "description", length: 255 })
	description: string;

	@Column({ type: "float", name: "amount" })
	amount: number;

	@Column({ type: "enum", name: "type", enum: ExpenseType })
	type: ExpenseType;

	@Column({ type: "timestamp", name: "date" })
	date: Date;

	@ManyToOne(
		() => User,
		(user) => user.expenses,
	)
	user: User;

	@OneToOne(() => Category)
	category: Category;
}

export { Expense, ExpenseType };
