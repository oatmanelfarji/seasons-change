import { format } from "date-fns";
import { useEffect, useState } from "react";
import { SeasonProgress } from "@/components/season-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getHemisphere } from "@/lib/location-utils";
import {
	getCurrentSeason,
	type Season,
	seasonConfig,
} from "@/lib/season-utils";

function calculateSeasonProgress(season: Season): number {
	const now = new Date();
	const start = new Date(season.startDate);
	const end = new Date(season.endDate);

	const totalDuration = end.getTime() - start.getTime();
	const elapsed = now.getTime() - start.getTime();

	const progress = (elapsed / totalDuration) * 100;
	return Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
}

function calculateDaysRemaining(season: Season): number {
	const now = new Date();
	const end = new Date(season.endDate);
	const remaining = end.getTime() - now.getTime();
	return Math.max(Math.ceil(remaining / (1000 * 60 * 60 * 24)), 0);
}

interface CurrentSeasonProps {
	hemisphere?: "northern" | "southern" | "equator" | null;
	latitude?: string | number;
}

export function CurrentSeason({ hemisphere, latitude }: CurrentSeasonProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex items-center gap-2 min-w-48 h-8 rounded-full bg-muted animate-pulse" />
		);
	}

	// Determine hemisphere: prioritizing explicit prop, then calculating from latitude, defaulting to northern
	const detectedHemisphere =
		hemisphere ||
		(latitude !== undefined ? getHemisphere(latitude) : "northern");

	const currentSeason = getCurrentSeason(detectedHemisphere);

	if (!currentSeason) return null;

	const config = seasonConfig[currentSeason.name];
	const Icon = config.icon;
	const progress = calculateSeasonProgress(currentSeason);
	const daysRemaining = calculateDaysRemaining(currentSeason);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="flex items-center gap-2 hover:scale-110 transition-all duration-300 cursor-pointer">
					<SeasonProgress
						value={progress}
						progressColor={config.progressColor}
						bgColor={config.bgColor}
					>
						<div className="flex items-center justify-between gap-2 min-w-48">
							<div className="flex items-center gap-2">
								<Icon
									className={`h-5 w-5 ${config.iconColor} drop-shadow-md`}
								/>
								<span
									className={`text-xs font-bold ${config.iconColor} drop-shadow-md capitalize`}
								>
									{currentSeason.name}
								</span>
							</div>
							<span
								className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
							>
								{Math.round(progress)}%
							</span>
						</div>
					</SeasonProgress>
				</div>
			</TooltipTrigger>
			<TooltipContent
				side="bottom"
				sideOffset={12}
				className={`p-4 border-2 ${config.borderColor} bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-xl`}
			>
				<div className="flex flex-col gap-3 min-w-[200px]">
					<div className="flex items-center justify-between">
						<span
							className={`text-lg font-black uppercase tracking-tighter ${config.iconColor}`}
						>
							{currentSeason.name}
						</span>
						<div
							className={`p-1.5 rounded-full ${config.bgColor} border ${config.borderColor}/30`}
						>
							<Icon className={`h-4 w-4 ${config.iconColor}`} />
						</div>
					</div>

					<div className={`space-y-1.5 border-y ${config.borderColor}/20 py-2`}>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Hemisphere:</span>
							<span className="font-semibold capitalize text-indigo-900 dark:text-indigo-100">
								{detectedHemisphere}
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Interval:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{format(new Date(currentSeason.startDate), "MMM d")} —{" "}
								{format(new Date(currentSeason.endDate), "MMM d")}
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Progress:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{Math.round(progress)}% Complete
							</span>
						</div>
					</div>

					<div className="pt-1 flex items-center justify-center gap-2">
						<div
							className={`h-1.5 w-1.5 rounded-full ${config.progressColor} animate-ping`}
						/>
						<span
							className={`text-[10px] font-bold uppercase tracking-widest ${config.iconColor}`}
						>
							{daysRemaining} Days Until Transition
						</span>
					</div>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
