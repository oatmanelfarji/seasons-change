import { date, index, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { countries } from "./countries";

export const typeEnum = pgEnum("type", [
	"national",
	"religious",
	"international",
	"other",
]);

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
		type: typeEnum("type"),
		description: text("description"),
	},
	(table) => [
		index("holidays_country_start_date_idx").on(
			table.countryCode,
			table.startDate,
		),
	],
);

export type SelectHoliday = typeof holidays.$inferSelect;
export type Holiday = SelectHoliday;
