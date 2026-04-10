import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { CurrentAstroHouse } from "@/components/current-astro-house";
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
		<div className="flex flex-1 flex-col gap-6 p-6 pt-0 overflow-x-hidden min-w-0 stagger-in">
			<div className="flex items-center justify-center gap-4">
				{/* Progress bars */}
				<div className="card-surface-interactive max-w-3xl overflow-hidden">
					<div className="flex flex-row flex-wrap gap-4 items-center justify-center p-5">
						<CurrentSeason hemisphere={hemisphere} />
						<CurrentYear hemisphere={hemisphere} />
						<CurrentAstroHouse />
					</div>
				</div>
			</div>

			<div className="grid auto-rows-min gap-6 md:grid-cols-2 my-6">
				{/* Selected country info */}
				<div className="card-surface-interactive overflow-hidden">
					<div className="flex flex-col items-center justify-center p-6">
						<SelectedCountryInfo />
					</div>
				</div>

				{/* Weather widget */}
				<div className="card-surface-interactive overflow-hidden">
					<WeatherWidget />
				</div>
			</div>
		</div>
	);
}
