import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import countries from "@/data/countries.json";
import { cn } from "@/lib/utils";

export interface Timezone {
	zoneName: string;
	gmtOffset: number;
	gmtOffsetName: string;
	abbreviation: string;
	tzName: string;
}

export interface Translations {
	ar: string;
	[key: string]: string;
}

export interface Country {
	id: number;
	name: string;
	emoji: string;
	iso2: string;
	latitude: string;
	native: string;
	capital: string;
	population: number | null;
	subregion: string;
	area_sq_km: number | null;
	timezones: Timezone[];
	translations: Translations;
	wikiDataId: string;
}

interface CountrySelectorProps {
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	placeholder?: string;
}

export function CountrySelector({
	value,
	onChange,
	className,
	placeholder = "Select country...",
}: CountrySelectorProps) {
	const [open, setOpen] = React.useState(false);

	const selectedCountry = React.useMemo(
		() => (countries as Country[]).find((country) => country.iso2 === value),
		[value],
	);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("justify-between", className)}
				>
					<span className="flex items-center gap-2 overflow-hidden truncate">
						{selectedCountry ? (
							<span className="text-sm leading-none">
								{selectedCountry.emoji}
							</span>
						) : (
							placeholder
						)}
					</span>
					<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0" align="start">
				<div className="max-h-[300px] overflow-y-auto p-1">
					{(countries as Country[]).map((country) => (
						<DropdownMenuItem
							key={country.iso2}
							onSelect={() => {
								onChange?.(country.iso2);
								setOpen(false);
							}}
							className="flex items-center gap-1 cursor-pointer"
						>
							<Check
								className={cn(
									"my-1 h-3 w-3 shrink-0",
									value === country.iso2 ? "opacity-100" : "opacity-0",
								)}
							/>
							<span className="text-sm leading-none">{country.emoji}</span>
							<span className="truncate">{country.name}</span>
						</DropdownMenuItem>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
