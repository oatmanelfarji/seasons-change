import { format } from "date-fns";
import { CalendarClock, Milestone } from "lucide-react";
import { useEffect, useState } from "react";
import { SeasonProgress } from "@/components/season-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getHemisphere } from "@/lib/location-utils";
import { getCurrentSeason, seasonConfig } from "@/lib/season-utils";

interface CurrentYearProps {
	hemisphere?: "northern" | "southern" | "equator" | null;
	latitude?: string | number;
}

export function CurrentYear({ hemisphere, latitude }: CurrentYearProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex items-center gap-2 min-w-48 h-8 rounded-full bg-muted animate-pulse" />
		);
	}

	const now = new Date();
	const currentYear = now.getFullYear();
	const startOfYearDate = new Date(currentYear, 0, 1);
	const endOfYearDate = new Date(currentYear + 1, 0, 1);

	const totalDuration = endOfYearDate.getTime() - startOfYearDate.getTime();
	const elapsed = now.getTime() - startOfYearDate.getTime();
	const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

	const daysPassed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
	const totalDays = Math.floor(totalDuration / (1000 * 60 * 60 * 24));
	const daysRemaining = totalDays - daysPassed;

	const detectedHemisphere =
		hemisphere ||
		(latitude !== undefined ? getHemisphere(latitude) : "northern");

	const currentSeason = getCurrentSeason(detectedHemisphere);
	const config = currentSeason
		? seasonConfig[currentSeason.name]
		: {
				icon: CalendarClock,
				bgColor: "bg-primary/10",
				iconColor: "text-primary",
				progressColor: "bg-primary",
				borderColor: "border-primary",
			};

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
							<span
								className={`text-xs font-bold ${config.iconColor} drop-shadow-md`}
							>
								{currentYear}
							</span>
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
							Year {currentYear}
						</span>
						<div
							className={`p-1.5 rounded-full ${config.bgColor} border ${config.borderColor}/30`}
						>
							<Milestone className={`h-4 w-4 ${config.iconColor}`} />
						</div>
					</div>

					<div className={`space-y-1.5 border-y ${config.borderColor}/20 py-2`}>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Elapsed:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{daysPassed} / {totalDays} Days
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Today:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{format(now, "MMMM do")}
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Progress:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{Math.round(progress)}% of Year Complete
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
							{daysRemaining} Days Until {currentYear + 1}
						</span>
					</div>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
