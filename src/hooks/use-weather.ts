import { useQuery } from "@tanstack/react-query";
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
	const query = useQuery({
		queryKey: ["weather", location],
		queryFn: async (): Promise<WeatherData> => {
			if (!location) throw new Error("Location is required");

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

			return response.json();
		},
		enabled: !!location,
		staleTime: 1000 * 60 * 15, // Cache for 15 minutes
	});

	return {
		data: query.data,
		loading: query.isLoading,
		error: query.error ? (query.error as Error).message : null,
	};
}
