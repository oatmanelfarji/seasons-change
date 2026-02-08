import * as React from "react";
import { type Country } from "@/components/country-selector";
import countriesData from "@/data/countries.json";

interface CountryContextType {
	countryCode: string;
	setCountryCode: (code: string) => void;
	selectedCountry: Country | undefined;
}

const CountryContext = React.createContext<CountryContextType | undefined>(
	undefined,
);

interface CountryProviderProps {
	children: React.ReactNode;
	defaultCountryCode?: string;
}

export function CountryProvider({
	children,
	defaultCountryCode = "US",
}: CountryProviderProps) {
	const [countryCode, setCountryCode] =
		React.useState<string>(defaultCountryCode);

	const selectedCountry = React.useMemo(
		() => (countriesData as Country[]).find((c) => c.iso2 === countryCode),
		[countryCode],
	);

	const value = React.useMemo(
		() => ({
			countryCode,
			setCountryCode,
			selectedCountry,
		}),
		[countryCode, selectedCountry],
	);

	return (
		<CountryContext.Provider value={value}>{children}</CountryContext.Provider>
	);
}

export function useCountry() {
	const context = React.useContext(CountryContext);
	if (context === undefined) {
		throw new Error("useCountry must be used within a CountryProvider");
	}
	return context;
}
