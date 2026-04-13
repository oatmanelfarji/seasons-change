import { boolean, index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./users";

export const todos = pgTable(
	"todos",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		isDone: boolean("is_done").default(false),
		date: timestamp("date"),
		userId: text("user_id").references(() => user.id),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [
		index("todos_date_idx").on(table.date),
		index("todos_user_id_idx").on(table.userId),
	],
);
