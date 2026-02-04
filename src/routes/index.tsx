import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { type Country, CountrySelector } from "@/components/country-selector";
import { CurrentSeason } from "@/components/current-season";
import { CurrentYear } from "@/components/current-year";
import countriesData from "@/data/countries.json";
import { getHemisphere } from "@/lib/location-utils";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const [countryCode, setCountryCode] = React.useState<string>("US");

	const selectedCountry = React.useMemo(
		() => (countriesData as Country[]).find((c) => c.iso2 === countryCode),
		[countryCode],
	);

	const hemisphere = React.useMemo(() => {
		if (!selectedCountry) return null;
		return getHemisphere(selectedCountry.latitude);
	}, [selectedCountry]);

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center gap-4">
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Current Season</h1>
						<CurrentSeason hemisphere={hemisphere} />
					</div>
				</div>
				<div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center gap-4">
					<div className="flex flex-col items-center justify-center gap-2">
						<h1>Current Year</h1>
						<CurrentYear hemisphere={hemisphere} />
					</div>
				</div>
				<div className="bg-muted/50 aspect-video rounded-xl flex flex-col items-center justify-center gap-4 p-6">
					<h1>Country Selector</h1>
					<CountrySelector value={countryCode} onChange={setCountryCode} />
					{selectedCountry && (
						<div className="mt-2 text-center">
							<p className="text-sm font-medium">
								{selectedCountry.emoji} {selectedCountry.name}
							</p>
							<p className="text-xs text-muted-foreground capitalize">
								- {hemisphere} Hemisphere.
							</p>
						</div>
					)}
				</div>
			</div>
			<div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min">
				Continuous Calendar
			</div>
		</div>
	);
}
