import { createFileRoute } from "@tanstack/react-router";
import {
	Anchor,
	Clock,
	Coins,
	ExternalLink,
	Globe,
	Hash,
	Info,
	Languages,
	MapPin,
	Phone,
	SquareStack,
	Tag,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCountry } from "@/lib/country-context";

export const Route = createFileRoute("/CountriesInfo")({
	component: CountriesInfo,
});

// Define a more complete Country type based on the JSON structure
interface FullCountry {
	id: number;
	name: string;
	iso3: string;
	iso2: string;
	numeric_code: string;
	phonecode: string;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	tld: string;
	native: string;
	population: number | null;
	gdp: number | null;
	region: string;
	region_id: number;
	subregion: string;
	subregion_id: number;
	nationality: string;
	area_sq_km: number | null;
	latitude: string;
	longitude: string;
	emoji: string;
	emojiU: string;
	wikiDataId: string;
	timezones: Array<{
		zoneName: string;
		gmtOffset: number;
		gmtOffsetName: string;
		abbreviation: string;
		tzName: string;
	}>;
	translations: Record<string, string>;
}

function CountriesInfo() {
	const { selectedCountry } = useCountry();
	const country = selectedCountry as unknown as FullCountry;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	if (!country) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-4">
				<div className="p-4 rounded-full bg-muted animate-pulse">
					<Globe className="w-12 h-12 text-muted-foreground" />
				</div>
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight">
						No Country Selected
					</h2>
					<p className="text-muted-foreground max-w-md">
						Please select a country from the selector in the header to view its
						detailed information.
					</p>
				</div>
			</div>
		);
	}

	const sections = [
		{
			id: "general",
			title: "General Information",
			icon: <Info className="w-5 h-5" />,
			items: [
				{
					label: "Native Name",
					value: country.native,
					icon: <Languages className="w-4 h-4" />,
				},
				{
					label: "Capital",
					value: country.capital,
					icon: <Anchor className="w-4 h-4" />,
				},
				{
					label: "Nationality",
					value: country.nationality,
					icon: <Tag className="w-4 h-4" />,
				},
				{
					label: "Region",
					value: country.region,
					icon: <Globe className="w-4 h-4" />,
				},
				{
					label: "Subregion",
					value: country.subregion,
					icon: <MapPin className="w-4 h-4" />,
				},
			],
		},
		{
			id: "demographics",
			title: "Demographics & Economy",
			icon: <Users className="w-5 h-5" />,
			items: [
				{
					label: "Population",
					value: country.population?.toLocaleString(),
					icon: <Users className="w-4 h-4" />,
				},
				{
					label: "Area",
					value: country.area_sq_km
						? `${country.area_sq_km.toLocaleString()} km²`
						: null,
					icon: <SquareStack className="w-4 h-4" />,
				},
				{
					label: "Currency",
					value: `${country.currency_name} (${country.currency_symbol})`,
					icon: <Coins className="w-4 h-4" />,
				},
				{
					label: "GDP",
					value: country.gdp ? `$${country.gdp.toLocaleString()}` : "N/A",
					icon: <Hash className="w-4 h-4" />,
				},
			],
		},
		{
			id: "codes",
			title: "Codes & Connectivity",
			icon: <Phone className="w-5 h-5" />,
			items: [
				{
					label: "ISO Alpha-2",
					value: country.iso2,
					icon: <Tag className="w-4 h-4" />,
				},
				{
					label: "ISO Alpha-3",
					value: country.iso3,
					icon: <Tag className="w-4 h-4" />,
				},
				{
					label: "Phone Code",
					value: `+${country.phonecode}`,
					icon: <Phone className="w-4 h-4" />,
				},
				{
					label: "Top Level Domain",
					value: country.tld,
					icon: <Globe className="w-4 h-4" />,
				},
			],
		},
	];

	return (
		<div className="max-w-6xl mx-auto px-4 py-8 space-y-12 stagger-in">
			{/* Hero Header */}
			<header className="relative group overflow-hidden rounded-4xl bg-linear-to-br from-primary/10 via-background to-primary/5 border border-primary/20 p-8 md:p-12 text-center transition-all duration-700 hover:shadow-2xl hover:shadow-primary/5">
				<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary),0.05),transparent)] pointer-events-none" />

				<div className="relative space-y-6">
					<div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-background border border-primary/20 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
						<span className="text-6xl">{country.emoji}</span>
					</div>

					<div className="space-y-2">
						<h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
							{country.name}
						</h1>
						<p className="text-xl font-medium text-muted-foreground italic">
							{country.native}
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-3">
						<span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
							{country.region}
						</span>
						<span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
							{country.subregion}
						</span>
						{country.currency && (
							<span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
								{country.currency}
							</span>
						)}
					</div>
				</div>
			</header>

			{/* Main Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{sections.map((section) => (
					<div
						key={section.id}
						className="group p-6 rounded-4xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
					>
						<div className="flex items-center gap-3 mb-6">
							<div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
								{section.icon}
							</div>
							<h3 className="font-bold text-lg">{section.title}</h3>
						</div>

						<div className="space-y-4">
							{section.items.map((item) =>
								item.value ? (
									<div
										key={item.label}
										className="flex flex-col gap-1 p-3 rounded-2xl bg-muted/30 group-hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/70">
											{item.icon}
											{item.label}
										</div>
										<div className="text-sm font-bold truncate">
											{item.value}
										</div>
									</div>
								) : null,
							)}
						</div>
					</div>
				))}

				{/* Location Card */}
				<div className="group p-6 rounded-4xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
							<MapPin className="w-5 h-5" />
						</div>
						<h3 className="font-bold text-lg">Coordinates</h3>
					</div>

					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="p-3 rounded-2xl bg-muted/30">
								<div className="text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
									Latitude
								</div>
								<div className="text-sm font-bold">{country.latitude}</div>
							</div>
							<div className="p-3 rounded-2xl bg-muted/30">
								<div className="text-[10px] uppercase font-bold text-muted-foreground/70 mb-1">
									Longitude
								</div>
								<div className="text-sm font-bold">{country.longitude}</div>
							</div>
						</div>
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${country.latitude},${country.longitude}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-foreground text-background font-bold text-sm transition-all hover:bg-foreground/90 active:scale-95 mt-4"
						>
							View on Maps
							<ExternalLink className="w-4 h-4" />
						</a>
					</div>
				</div>

				{/* Timezones Card */}
				<div className="group p-6 rounded-4xl bg-background border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 hover:-translate-y-1 lg:col-span-2">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
							<Clock className="w-5 h-5" />
						</div>
						<h3 className="font-bold text-lg">Timezones</h3>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{country.timezones?.map((tz) => (
							<div
								key={tz.zoneName}
								className="p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all"
							>
								<div className="flex justify-between items-start mb-2">
									<div className="text-xs font-bold text-primary">
										{tz.abbreviation}
									</div>
									<div className="px-2 py-0.5 rounded-md bg-primary/20 text-[10px] font-black">
										{tz.gmtOffsetName}
									</div>
								</div>
								<div className="text-sm font-bold mb-1">{tz.tzName}</div>
								<div className="text-[10px] text-muted-foreground truncate">
									{tz.zoneName}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Wiki Card */}
				<div className="group p-6 rounded-4xl bg-primary border border-primary/20 shadow-xl shadow-primary/20 transition-all duration-500 hover:-translate-y-1 text-primary-foreground">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2.5 rounded-2xl bg-background/20 text-primary-foreground group-hover:scale-110 transition-transform">
							<ExternalLink className="w-5 h-5" />
						</div>
						<h3 className="font-bold text-lg">External Resources</h3>
					</div>

					<p className="text-sm font-medium opacity-90 mb-6">
						Explore more detailed information about {country.name} on Wikidata.
					</p>

					<a
						href={`https://www.wikidata.org/wiki/${country.wikiDataId}`}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-between w-full p-4 rounded-2xl bg-background text-primary font-black text-sm transition-all hover:scale-[1.02] active:scale-95"
					>
						<span>GO TO WIKIDATA</span>
						<span className="text-xs opacity-50">({country.wikiDataId})</span>
					</a>
				</div>
			</div>

			{/* Translations Section */}
			<section className="space-y-6 pb-12">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
						<Languages className="w-5 h-5" />
					</div>
					<h3 className="font-bold text-xl uppercase tracking-tighter">
						Translations
					</h3>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
					{Object.entries(country.translations || {}).map(([lang, name]) => (
						<div
							key={lang}
							className="p-3 rounded-2xl bg-muted/30 border border-border/50 text-center hover:bg-muted/50 transition-colors"
						>
							<div className="text-[10px] font-black text-muted-foreground/50 uppercase mb-1">
								{lang}
							</div>
							<div className="text-xs font-bold truncate" title={name}>
								{name}
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
