import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Category {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", name: "name", length: 255 })
	name: string;

	@Column({ type: "varchar", name: "description", length: 255, nullable: true })
	description: string;
}

export { Category };
