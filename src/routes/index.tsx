import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { ContinuousCalendar } from "@/components/ContinuousCalendar";
import { CurrentSeason } from "@/components/current-season";
import { CurrentYear } from "@/components/current-year";
import { SelectedCountryInfo } from "@/components/selectedCountryInfo";
import { WeatherWidget } from "@/components/weather-widget";
import { useCountry } from "@/lib/country-context";
import { getHemisphere } from "@/lib/location-utils";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { selectedCountry } = useCountry();

	const hemisphere = React.useMemo(() => {
		if (!selectedCountry) return null;
		return getHemisphere(selectedCountry.latitude);
	}, [selectedCountry]);

	return (
		<div className="flex flex-1 flex-col gap-8 p-8 pt-0 overflow-x-hidden min-w-0 stagger-in">
			<div className="flex items-center justify-center gap-4">
				{/* Progress bars */}
				<div className="relative glass rounded-3xl flex flex-col shadow-xl shadow-primary/5 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
					<div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none" />
					<div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-700 pointer-events-none" />
					<div className="relative z-10 flex-1 flex flex-row gap-4 items-center justify-center p-6">
						<CurrentSeason hemisphere={hemisphere} />
						<CurrentYear hemisphere={hemisphere} />
					</div>
				</div>
			</div>

			<div className="grid auto-rows-min gap-8 md:grid-cols-2 my-8">
				{/* Selected country info */}
				<div className="relative glass rounded-3xl flex flex-col shadow-xl shadow-primary/5 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
					<div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none" />
					<div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-700 pointer-events-none" />

					<div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
						<SelectedCountryInfo />
					</div>
				</div>

				{/* Weather widget */}
				<div className="relative glass rounded-3xl flex flex-col shadow-xl shadow-primary/5 group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
					<div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none" />
					<div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-700 pointer-events-none" />

					<div className="relative z-10 h-full">
						<WeatherWidget />
					</div>
				</div>
			</div>
			<div className="glass min-h-[600px] flex-1 rounded-3xl md:min-h-min overflow-hidden min-w-0 shadow-2xl shadow-primary/10">
				<ContinuousCalendar
					onClick={(day, month, year) => {
						// Future: Open event/holiday modal for selected date
						console.log(`Clicked: ${month + 1}/${day}/${year}`);
					}}
				/>
			</div>
		</div>
	);
}
