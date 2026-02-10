import { Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import seasonsData from "@/data/seasons.json";

export type Season = {
	name: "spring" | "summer" | "autumn" | "winter";
	startDate: string;
	endDate: string;
};

type SeasonsData = {
	"northern-hemisphere": {
		[year: string]: Season[];
	};
	"southern-hemisphere": {
		[year: string]: Season[];
	};
};

export const seasonConfig = {
	spring: {
		icon: Flower2,
		bgColor: "bg-green-100 dark:bg-green-900/30",
		iconColor: "text-green-900 dark:text-green-900",
		progressColor: "bg-[var(--spring-primary)]",
		borderColor: "border-green-900 dark:border-green-900",
	},
	summer: {
		icon: Sun,
		bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
		iconColor: "text-yellow-900 dark:text-yellow-900",
		progressColor: "bg-[var(--summer-primary)]",
		borderColor: "border-yellow-900 dark:border-yellow-900",
	},
	autumn: {
		icon: Leaf,
		bgColor: "bg-orange-100 dark:bg-orange-900/30",
		iconColor: "text-orange-900 dark:text-orange-900",
		progressColor: "bg-[var(--autumn-primary)]",
		borderColor: "border-orange-900 dark:border-orange-900",
	},
	winter: {
		icon: Snowflake,
		bgColor: "bg-blue-100 dark:bg-blue-900/30",
		iconColor: "text-blue-900 dark:text-blue-900",
		progressColor: "bg-[var(--winter-primary)]",
		borderColor: "border-blue-900 dark:border-blue-900",
	},
} as const;

export function getCurrentSeason(
	hemisphere: "northern" | "southern" | "equator" = "northern",
): Season | null {
	const now = new Date();
	const year = now.getFullYear();
	// Use local time instead of UTC to avoid timezone issues (e.g., getting "tomorrow's" date)
	const currentDate = now.toLocaleDateString("en-CA"); // YYYY-MM-DD format in local time

	// Default to northern-hemisphere for equator or anything else
	const hemisphereKey =
		hemisphere === "southern" ? "southern-hemisphere" : "northern-hemisphere";

	const data = seasonsData as SeasonsData;

	/* 
    Check current year seasons first.
  */
	const seasons = data[hemisphereKey][year.toString()];
	if (seasons) {
		for (const season of seasons) {
			if (currentDate >= season.startDate && currentDate <= season.endDate) {
				return season;
			}
		}
	}

	// If not found, check the previous year (for Winter crossover)
	const prevYearSeasons = data[hemisphereKey][(year - 1).toString()];
	if (prevYearSeasons) {
		for (const season of prevYearSeasons) {
			if (currentDate >= season.startDate && currentDate <= season.endDate) {
				return season;
			}
		}
	}

	return null;
}
