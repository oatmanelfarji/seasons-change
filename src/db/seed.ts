import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import countriesData from "../data/countries.json";
import islamicHolidays from "../data/islamic-holidays.json";
import moroccanHolidays from "../data/MoroccanHolidays.json";
import manazilData from "../data/manazil.json";
import seasonsData from "../data/seasons.json";
import zodiacData from "../data/zodiac_sign.json";
import * as schema from "./schema";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
	console.log("🌱 Seeding database...");

	try {
		// 1. Seed Countries
		console.log("Seeding countries...");
		const countriesToInsert = countriesData.map((c: any) => ({
			id: c.id,
			name: c.name,
			iso3: c.iso3,
			iso2: c.iso2,
			numericCode: c.numeric_code,
			phonecode: c.phonecode,
			capital: c.capital,
			currency: c.currency,
			currencyName: c.currency_name,
			currencySymbol: c.currency_symbol,
			tld: c.tld,
			native: c.native,
			region: c.region,
			subregion: c.subregion,
			nationality: c.nationality,
			timezones: c.timezones,
			translations: c.translations,
			latitude: c.latitude,
			longitude: c.longitude,
			emoji: c.emoji,
			emojiU: c.emojiU,
			wikiDataId: c.wikiDataId,
			population: c.population,
			gdp: c.gdp,
			regionId: c.region_id,
			subregionId: c.subregion_id,
			areaSqKm: c.area_sq_km,
			postalCodeFormat: c.postal_code_format,
			postalCodeRegex: c.postal_code_regex,
		}));

		await db
			.insert(schema.countries)
			.values(countriesToInsert)
			.onConflictDoNothing();

		// 2. Seed Zodiac Signs
		console.log("Seeding zodiac signs...");
		const zodiacToInsert = zodiacData.map((z: any) => ({
			id: z.id,
			name: z.name,
			nameAr: z.nameAr,
			startDate: z.startDate,
			endDate: z.endDate,
		}));

		await db
			.insert(schema.zodiacSigns)
			.values(zodiacToInsert)
			.onConflictDoNothing();

		// 3. Seed Astronomical Houses
		console.log("Seeding astronomical houses...");
		const housesToInsert = manazilData.map((m: any) => ({
			id: m.id,
			season: m.season,
			period: m.period,
			englishPeriod: m.englishPeriod,
			houseName: m.house,
			englishName: m.englishName,
			startDate: m.startDate,
			duration: m.duration,
			description: m.description,
			zodiacSignNames: m.zodiacSign,
			zodiacSignNamesAr: m.zodiacSignAr,
			zodiacStartDays: m.zodiacStartDays,
			zodiacEndDays: m.zodiacEndDays,
		}));

		await db
			.insert(schema.astronomicalHouses)
			.values(housesToInsert)
			.onConflictDoNothing();

		// 4. Seed Holidays (Morocco)
		console.log("Seeding Moroccan holidays...");
		const months: { [key: string]: string } = {
			January: "01",
			February: "02",
			March: "03",
			April: "04",
			May: "05",
			June: "06",
			July: "07",
			August: "08",
			September: "09",
			October: "10",
			November: "11",
			December: "12",
		};

		const formatDate = (dateStr: string) => {
			const [month, day] = dateStr.split(" ");
			const mm = months[month];
			const dd = day.padStart(2, "0");
			return `2025-${mm}-${dd}`;
		};

		const holidaysToInsert = moroccanHolidays.map((h: any) => ({
			name: h.name,
			localName: h.localName,
			startDate: formatDate(h.startDate),
			endDate: formatDate(h.startDate), // Same day for now
			countryCode: h.countryCode,
			type: h.type,
			description: h.description,
		}));

		await db
			.insert(schema.holidays)
			.values(holidaysToInsert)
			.onConflictDoNothing();

		// 4b. Seed Islamic Holidays
		console.log("Seeding Islamic holidays...");
		const islamicHolidaysToInsert = islamicHolidays.map((h: any) => ({
			name: h.name,
			localName: h.localName,
			startDate: h.date,
			endDate: h.date,
			countryCode: h.countryCode,
			type: h.type,
			description: h.description,
		}));

		await db
			.insert(schema.holidays)
			.values(islamicHolidaysToInsert)
			.onConflictDoNothing();

		// 5. Seed Seasons
		console.log("Seeding seasons...");
		const seasonsToInsert: any[] = [];

		// Northern Hemisphere (defaulting to MA for now as an example, though seasons vary)
		// Actually seasons table has countryCode which is NOT NULL references countries.iso2
		// Let's seed for Morocco (MA)
		for (const [year, yearSeasons] of Object.entries(
			seasonsData["northern-hemisphere"],
		)) {
			if (parseInt(year) >= 2025 && parseInt(year) <= 2026) {
				yearSeasons.forEach((s: any) => {
					seasonsToInsert.push({
						name: s.name,
						startDate: s.startDate,
						endDate: s.endDate,
						year: year,
						countryCode: "MA",
					});
				});
			}
		}

		await db
			.insert(schema.seasons)
			.values(seasonsToInsert)
			.onConflictDoNothing();

		console.log("✅ Seeding completed!");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	} finally {
		await pool.end();
	}
}

seed();
