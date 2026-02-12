import {
	AlertCircle,
	Cloud,
	CloudRain,
	CloudSun,
	Droplets,
	Loader2,
	Sun,
	Wind,
} from "lucide-react";
import type * as React from "react";
import { useWeather } from "@/hooks/use-weather";
import { useCountry } from "@/lib/country-context";

const weatherIcons: Record<number, React.ReactNode> = {
	1000: <Sun className="w-12 h-12 text-yellow-400" />, // Clear
	1100: <CloudSun className="w-12 h-12 text-yellow-300" />, // Mostly Clear
	1101: <CloudSun className="w-12 h-12 text-blue-300" />, // Partly Cloudy
	1102: <Cloud className="w-12 h-12 text-gray-400" />, // Mostly Cloudy
	1001: <Cloud className="w-12 h-12 text-gray-500" />, // Cloudy
	4000: <CloudRain className="w-12 h-12 text-blue-500" />, // Drizzle
	4001: <CloudRain className="w-12 h-12 text-blue-600" />, // Rain
	4200: <CloudRain className="w-12 h-12 text-blue-700" />, // Light Rain
	4201: <CloudRain className="w-12 h-12 text-blue-800" />, // Heavy Rain
};

const weatherDescriptions: Record<number, string> = {
	1000: "Clear",
	1100: "Mostly Clear",
	1101: "Partly Cloudy",
	1102: "Mostly Cloudy",
	1001: "Cloudy",
	4000: "Drizzle",
	4001: "Rain",
	4200: "Light Rain",
	4201: "Heavy Rain",
};

export function WeatherWidget() {
	const { selectedCountry } = useCountry();
	const location = selectedCountry?.capital || selectedCountry?.name;
	const { data, loading, error } = useWeather(location);

	if (!selectedCountry) {
		return (
			<div className="flex flex-col items-center justify-center p-6 text-muted-foreground italic">
				Select a country to see weather
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center p-6 gap-2 animate-pulse">
				<Loader2 className="w-8 h-8 animate-spin text-primary/50" />
				<p className="text-sm font-medium text-muted-foreground">
					Fetching weather for {location}...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center p-6 gap-2 text-destructive">
				<AlertCircle className="w-8 h-8" />
				<p className="text-sm font-medium text-center">Error: {error}</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-2 text-xs underline hover:no-underline"
				>
					Try again
				</button>
			</div>
		);
	}

	if (!data) return null;

	const {
		temperature,
		weatherCode,
		humidity,
		windSpeed,
		precipitationProbability,
	} = data.data.values;
	const weatherIcon = weatherIcons[weatherCode] || (
		<Cloud className="w-12 h-12 text-gray-400" />
	);
	const weatherDesc = weatherDescriptions[weatherCode] || "Unknown";

	return (
		<div className="relative flex flex-col items-center gap-6 h-full justify-center p-16 group-hover:scale-105 transition-transform duration-500">
			<div className="flex items-center justify-between w-full">
				<div className="flex flex-col">
					<h2 className="text-lg font-bold tracking-tight font-display">
						{location}
					</h2>
				</div>
				<div className="p-2 rounded-xl bg-primary/10 backdrop-blur-xl border border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
					{weatherIcon}
				</div>
			</div>

			<div className="flex flex-col items-baseline gap-1.5">
				<div className="flex items-center gap-1">
					<span className="text-5xl font-bold tracking-tighter text-foreground font-display">
						{Math.round(temperature)}
					</span>
					<span className="text-xl font-bold text-primary opacity-60">°C</span>
				</div>
				<div className="flex items-center justify-center">
					<p className="text-[10px] text-primary font-bold uppercase tracking-widest opacity-80">
						{weatherDesc}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-3 w-full gap-3 mt-auto">
				{[
					{
						icon: Droplets,
						value: `${humidity}%`,
						label: "Humidity",
						color: "text-blue-500",
					},
					{
						icon: Wind,
						value: `${Math.round(windSpeed)}m/s`,
						label: "Wind",
						color: "text-teal-500",
					},
					{
						icon: CloudRain,
						value: `${precipitationProbability}%`,
						label: "Rain",
						color: "text-primary",
					},
				].map((item) => (
					<div
						key={item.label}
						className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:scale-105 hover:bg-white/10"
					>
						<item.icon className={`w-4 h-4 ${item.color}`} />
						<span className="text-sm font-black">{item.value}</span>
						<span className="text-[10px] uppercase text-muted-foreground font-bold opacity-60">
							{item.label}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
