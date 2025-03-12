import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}

export { User, UserRole };
