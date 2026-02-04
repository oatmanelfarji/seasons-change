import { Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import seasonsData from "@/data/seasons.json";

export type Season = {
	name: "spring" | "summer" | "autumn" | "winter";
	startDate: string;
	endDate: string;
};

type SeasonsData = {
	[year: string]: Season[];
};

export const seasonConfig = {
	spring: {
		icon: Flower2,
		bgColor: "bg-green-100 dark:bg-green-900/30",
		iconColor: "text-green-900 dark:text-green-900",
		progressColor: "bg-[var(--season-spring)]",
	},
	summer: {
		icon: Sun,
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		iconColor: "text-yellow-900 dark:text-yellow-900",
		progressColor: "bg-[var(--season-summer)]",
	},
	autumn: {
		icon: Leaf,
		bgColor: "bg-orange-100 dark:bg-orange-900/30",
		iconColor: "text-white dark:text-white",
		progressColor: "bg-[var(--season-autumn)]",
	},
	winter: {
		icon: Snowflake,
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
		iconColor: "text-blue-900 dark:text-blue-900",
		progressColor: "bg-[var(--season-winter)]",
	},
} as const;

export function getCurrentSeason(): Season | null {
	const now = new Date();
	const year = now.getFullYear();
	// Use local time instead of UTC to avoid timezone issues (e.g., getting "tomorrow's" date)
	const currentDate = now.toLocaleDateString("en-CA"); // YYYY-MM-DD format in local time

	/* 
    Check current year seasons first.
    If we are in early months (Jan/Feb/Mar), the Winter season likely started in the previous year.
  */
	const seasons = (seasonsData as SeasonsData)[year.toString()];
	if (seasons) {
		for (const season of seasons) {
			if (currentDate >= season.startDate && currentDate <= season.endDate) {
				return season;
			}
		}
	}

	// If not found, check the previous year (for Winter crossover)
	const prevYearSeasons = (seasonsData as SeasonsData)[(year - 1).toString()];
	if (prevYearSeasons) {
		for (const season of prevYearSeasons) {
			if (currentDate >= season.startDate && currentDate <= season.endDate) {
				return season;
			}
		}
	}

	return null;
}
