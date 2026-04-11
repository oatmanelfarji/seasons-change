import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "@/env";
import { db } from "./index";
import { holidays } from "./schema";

export interface WeatherData {
	data: {
		time: string;
		values: {
			temperature: number;
			humidity: number;
			weatherCode: number;
			windSpeed: number;
			precipitationProbability: number;
			[key: string]: string | number | boolean | null;
		};
	};
	location: {
		name: string;
		[key: string]: string | number | boolean | null;
	};
}

export const getHolidaysByCountry = createServerFn({
	method: "GET",
})
	.inputValidator((n: string) => n)
	.handler(async ({ data: countryCode }) => {
		return await db
			.select()
			.from(holidays)
			.where(eq(holidays.countryCode, countryCode))
			.orderBy(holidays.startDate);
	});

export const getWeather = createServerFn({
	method: "GET",
})
	.inputValidator(z.string())
	.handler(async ({ data: location }) => {
		if (!location) throw new Error("Location is required");

		const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(
			location,
		)}&apikey=${env.TOMORROW_IO_API_KEY}`;

		const response = await fetch(url, {
			headers: {
				accept: "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to fetch weather data");
		}

		return response.json();
	});
