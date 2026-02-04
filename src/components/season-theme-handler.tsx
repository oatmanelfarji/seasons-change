import { useEffect } from "react";
import { getCurrentSeason } from "@/lib/season-utils";

export function SeasonThemeHandler() {
	useEffect(() => {
		const updateSeasonTheme = () => {
			const season = getCurrentSeason();
			if (!season) return;

			const root = document.documentElement;
			// Remove existing theme classes
			root.classList.remove(
				"theme-spring",
				"theme-summer",
				"theme-autumn",
				"theme-winter",
			);

			// Add new theme class
			const themeClass = `theme-${season.name.toLowerCase()}`;
			root.classList.add(themeClass);
			localStorage.setItem("season-theme", themeClass);
		};

		// Initial update
		updateSeasonTheme();

		// Check every minute for season change
		const interval = setInterval(updateSeasonTheme, 1000 * 60);

		return () => clearInterval(interval);
	}, []);

	return null;
}
