import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useCountry } from "@/lib/country-context";

export function SelectedCountryInfo() {
	const [mounted, setMounted] = useState(false);
	const { selectedCountry } = useCountry();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	if (!selectedCountry) return null;

	return (
		<div className="w-full flex flex-col gap-6">
			<div className="flex flex-col items-center gap-2 text-center group-hover:scale-105 transition-transform duration-500">
				<span className="text-3xl drop-shadow-lg group-hover:rotate-12 transition-transform duration-500">
					{selectedCountry.emoji}
				</span>
				<div className="space-y-0.5">
					<h2 className="text-xl font-bold tracking-tight font-display">
						{selectedCountry.name}
					</h2>
					{selectedCountry.native &&
						selectedCountry.native !== selectedCountry.name && (
							<p className="text-sm font-medium text-muted-foreground italic">
								{selectedCountry.native}
							</p>
						)}
					{selectedCountry.translations?.ar && (
						<p className="text-lg font-bold text-primary" dir="rtl">
							{selectedCountry.translations.ar}
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{[
					{ label: "Region", value: selectedCountry.subregion, icon: "🌍" },
					{ label: "Capital", value: selectedCountry.capital, icon: "🏛️" },
					{
						label: "Population",
						value: selectedCountry.population?.toLocaleString(),
						icon: "👥",
					},
					{
						label: "Area",
						value: selectedCountry.area_sq_km
							? `${selectedCountry.area_sq_km.toLocaleString()} km²`
							: null,
						icon: "📐",
					},
					{
						label: "Timezone",
						value: selectedCountry.timezones?.[0]?.gmtOffsetName,
						icon: "🕐",
					},
				]
					.filter((item) => item.value)
					.map((item) => (
						<div
							key={item.label}
							className="flex flex-row items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/10 transition-all duration-300 hover:scale-105 hover:bg-primary/10"
						>
							<span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground opacity-70">
								{item.icon} {item.label}
							</span>
							<span className="text-sm font-bold">{item.value}</span>
						</div>
					))}
			</div>

			<div className="flex flex-col gap-2 mt-2">
				<Link
					to="/CountriesInfo"
					className="group/btn flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-sm transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/5"
				>
					<span>VIEW FULL REPORT</span>
					<ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
				</Link>

				{selectedCountry.wikiDataId && (
					<a
						href={`https://www.wikidata.org/wiki/${selectedCountry.wikiDataId}`}
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-center justify-center gap-2 p-3 rounded-2xl text-muted-foreground font-bold text-xs transition-all hover:text-foreground active:scale-95"
					>
						<span>Open in wikidata</span>
						<span className="text-[10px] opacity-50 font-mono">
							({selectedCountry.wikiDataId})
						</span>
					</a>
				)}
			</div>
		</div>
	);
}
