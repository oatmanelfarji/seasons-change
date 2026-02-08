import { useEffect, useState } from "react";
import { env } from "@/env";

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

export function useWeather(location?: string) {
	const [data, setData] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!location) {
			setData(null);
			setError(null);
			return;
		}

		const fetchWeather = async () => {
			setLoading(true);
			setError(null);
			try {
				const url = `https://api.tomorrow.io/v4/weather/realtime?location=${encodeURIComponent(
					location,
				)}&apikey=${env.VITE_TOMORROW_IO}`;

				const response = await fetch(url, {
					headers: {
						accept: "application/json",
					},
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || "Failed to fetch weather data");
				}

				const result = await response.json();
				setData(result);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "An unexpected error occurred";
				console.error("Weather fetch error:", err);
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchWeather();
	}, [location]);

	return { data, loading, error };
}
