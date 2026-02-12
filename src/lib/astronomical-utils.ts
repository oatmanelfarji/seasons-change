import { addDays, format, isLeapYear, parse, startOfYear } from "date-fns";
import manazilData from "../data/manazil.json";

export type AstronomicalHouse = {
	id: number;
	season: string;
	period: string;
	englishPeriod: string;
	house: string;
	englishName: string;
	startDate: string; // MM-DD
	duration: number;
	description: string;
	zodiacSign: string[];
	zodiacSignAr: string[];
};

export type HouseInstance = AstronomicalHouse & {
	calculatedStartDate: Date;
	calculatedEndDate: Date;
};

/**
 * Generates the full astronomical calendar for a given year,
 * correctly handling Leap Day by expanding House 7 (Sa'd al-Bula').
 */
export function getAstronomicalCalendar(year: number): HouseInstance[] {
	const isLeap = isLeapYear(new Date(year, 0, 1));

	return manazilData.map((house) => {
		// Parse the MM-DD into a real Date object for the given year
		// We use a safe parsing strategy: MM-DD-YYYY
		let houseDate = parse(
			`${house.startDate}-${year}`,
			"MM-dd-yyyy",
			new Date(),
		);

		// Edge case: If the house is part of the winter season and starts in December,
		// but we are looking at the "fiscal" astronomical year that starts Dec 7th
		// of the *previous* calendar year.
		// For simplicity, we assume the user wants the houses that *start* in the provided calendar year.

		let duration = house.duration;

		// Leap Year Adjustment: House 7 (Sa'd al-Bula') absorbs the extra day in February
		if (house.id === 7 && isLeap) {
			duration = 14;
		}

		const endDate = addDays(houseDate, duration - 1);

		return {
			...house,
			duration,
			calculatedStartDate: houseDate,
			calculatedEndDate: endDate,
		};
	});
}

/**
 * Finds the currently active astronomical house for a specific date.
 */
export function getHouseForDate(date: Date): HouseInstance | null {
	const year = date.getFullYear();

	// We check both the current year's calendar and the previous year's
	// to handle the December crossover (the astronomical year starts Dec 7).
	const yearsToCheck = [year - 1, year, year + 1];

	for (const y of yearsToCheck) {
		const calendar = getAstronomicalCalendar(y);
		const house = calendar.find(
			(h) => date >= h.calculatedStartDate && date <= h.calculatedEndDate,
		);
		if (house) return house;
	}

	return null;
}

/**
 * Returns the progress (0-100) within the current house.
 */
export function getHouseProgress(date: Date, house: HouseInstance): number {
	const start = house.calculatedStartDate.getTime();
	const end = house.calculatedEndDate.getTime() + 86400000; // Include the full end day
	const current = date.getTime();

	if (current < start) return 0;
	if (current > end) return 100;

	return ((current - start) / (end - start)) * 100;
}
