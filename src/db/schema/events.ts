import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { countries } from "./countries";
import { user } from "./users";

export const categoryEnum = pgEnum("category", [
	"national",
	"religious",
	"family",
	"personal",
	"work",
	"astronomical",
	"other",
]);

export const events = pgTable(
	"events",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		startTime: timestamp("start_time").notNull(),
		endTime: timestamp("end_time").notNull(),
		isAllDay: boolean("is_all_day").default(false),
		location: text("location"),
		countryCode: text("country_code").references(() => countries.iso2),
		category: categoryEnum("category").default("personal"),
		reminders: jsonb("reminders"),
		userId: text("user_id").references(() => user.id),
		syncId: text("sync_id"),
		source: text("source").default("local"),
		etag: text("etag"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [
		index("events_start_time_idx").on(table.startTime),
		index("events_user_id_idx").on(table.userId),
		index("events_country_idx").on(table.countryCode),
	],
);
