import { date, index, pgTable, serial, text } from "drizzle-orm/pg-core";
import { countries } from "./countries";

export const seasons = pgTable(
	"seasons",
	{
		id: serial("id").primaryKey(),
		name: text("name").notNull(),
		startDate: date("start_date").notNull(),
		endDate: date("end_date").notNull(),
		year: text("year").notNull(),
		countryCode: text("country_code").references(() => countries.iso2),
	},
	(table) => [index("seasons_country_idx").on(table.countryCode)],
);
