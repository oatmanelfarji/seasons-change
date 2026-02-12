import { sql } from "drizzle-orm";
import {
	boolean,
	check,
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

export const seasons = pgTable(
	"seasons",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(), // spring, summer, autumn, winter
		startDate: date("start_date").notNull(), // stored as month-day, can be used across years
		endDate: date("end_date").notNull(), // stored as month-day, can be used across years
		year: text("year").notNull(), // store which year this entry is for
		countryCode: text("country_code").references(() => countries.iso2),
	},
	(table) => [index("seasons_country_idx").on(table.countryCode)],
);

export const zodiacSigns = pgTable(
	"zodiac_signs",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		nameAr: text("name_ar").notNull(),
		startDate: text("start_date").notNull(), // MM-DD
		endDate: text("end_date").notNull(), // MM-DD
		description: text("description"),
	},
	(table) => [index("zodiac_signs_idx").on(table.name)],
);

export const astronomicalHouses = pgTable(
	"astronomical_houses",
	{
		id: serial("id").primaryKey(),
		season: text("season").notNull(), // winter, spring, summer, autumn
		period: text("period"), // e.g., المربعانية, الشبط, العقارب
		englishPeriod: text("english_period"), // e.g., Al-Muraba'aniyah, Al-Shabat, Al-Aqrab
		houseName: text("house_name").notNull(), // e.g., الإكليل
		englishName: text("english_name"),
		startDate: text("start_date").notNull(), // MM-DD
		duration: integer("duration").notNull(), // 13 or 14 days (1st of autumn is 14)
		description: text("description"),
		// Zodiac Sign overlap info (from manazil.json)
		zodiacSignNames: text("zodiac_sign_names").array(),
		zodiacSignNamesAr: text("zodiac_sign_names_ar").array(),
		zodiacStartDays: integer("zodiac_start_days").array(),
		zodiacEndDays: integer("zodiac_end_days").array(),
	},
	(table) => [
		check(
			"duration_check",
			sql`(${table.duration} = 13) OR (${table.id} IN (7, 22) AND ${table.duration} = 14)`,
		),
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
