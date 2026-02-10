import {
	boolean,
	date,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { countries } from "./countries";
import { user } from "./users";

// Re-export from other schema files
export * from "./countries";
export * from "./users";

export const holidays = pgTable(
	"holidays",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		localName: text("local_name").$default(() => ""),
		startDate: date("start_date").notNull(),
		endDate: date("end_date").notNull(),
		countryCode: text("country_code")
			.notNull()
			.references(() => countries.iso2),
		type: text("type"), // e.g., 'public', 'religious'
		description: text("description"),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => [
		index("holidays_country_start_date_idx").on(
			table.countryCode,
			table.startDate,
		),
	],
);

export const categoryEnum = pgEnum("category", [
	"national",
	"religious",
	"family",
	"personal",
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
		reminders: jsonb("reminders"), // Array of reminder configurations

		// User association
		userId: text("user_id").references(() => user.id),

		// Sync fields
		syncId: text("sync_id"), // ID from external provider
		source: text("source").default("local"), // 'local', 'google', 'nextcloud'
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

export const todos = pgTable(
	"todos",
	{
		id: serial("id").primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		isDone: boolean("is_done").default(false),
		date: timestamp("date"), // Optional date for calendar

		// User association
		userId: text("user_id").references(() => user.id),

		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => [
		index("todos_date_idx").on(table.date),
		index("todos_user_id_idx").on(table.userId),
	],
);

export const seasons = pgTable(
	"seasons",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(), // spring, summer, autumn, winter
		startDate: date("start_date").notNull(), // stored as month-day, can be used across years
		endDate: date("end_date").notNull(), // stored as month-day, can be used across years
		year: text("year").notNull(), // store which year this entry is for
		countryCode: text("country_code").references(() => countries.iso2),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(table) => [index("seasons_country_idx").on(table.countryCode)],
);

export const astronomicalHouses = pgTable("astronomical_houses", {
	id: serial("id").primaryKey(),
	season: text("season").notNull(),
	commonName: text("common_name").notNull(),
	englishName: text("english_name"),
	startDate: text("start_date").notNull(),
	starName: text("star_name").notNull(),
	starDays: integer("star_days").notNull(),
	zodiacSign: text("zodiac_sign").array(),
	zodiacDays: integer("zodiac_days").array(),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow(),
});
