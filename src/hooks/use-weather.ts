import { useQuery } from "@tanstack/react-query";
import { getWeather, type WeatherData } from "@/db/queries";

export type { WeatherData };

export function useWeather(location?: string) {
	const query = useQuery({
		queryKey: ["weather", location],
		queryFn: async (): Promise<WeatherData> => {
			if (!location) throw new Error("Location is required");
			return await getWeather({ data: location });
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
