import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	pgTable,
	serial,
	text,
} from "drizzle-orm/pg-core";

export const zodiacSigns = pgTable(
	"zodiac_signs",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		nameAr: text("name_ar").notNull(),
		startDate: text("start_date").notNull(),
		endDate: text("end_date").notNull(),
		description: text("description"),
	},
	(table) => [index("zodiac_signs_idx").on(table.name)],
);

export const astronomicalHouses = pgTable(
	"astronomical_houses",
	{
		id: serial("id").primaryKey(),
		season: text("season").notNull(),
		period: text("period"),
		englishPeriod: text("english_period"),
		houseName: text("house_name").notNull(),
		englishName: text("english_name"),
		startDate: text("start_date").notNull(),
		duration: integer("duration").notNull(),
		description: text("description"),
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
