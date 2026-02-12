import { format } from "date-fns";
import { Moon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SeasonProgress } from "@/components/season-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { getHouseForDate, getHouseProgress } from "@/lib/astronomical-utils";

export function CurrentAstroHouse() {
	const [mounted, setMounted] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		setMounted(true);
		// Update progress every minute
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	if (!mounted) {
		return (
			<div className="flex items-center gap-2 min-w-48 h-8 rounded-full bg-indigo-500/10 animate-pulse" />
		);
	}

	const currentHouse = getHouseForDate(currentTime);

	if (!currentHouse) return null;

	const progress = getHouseProgress(currentTime, currentHouse);
	const daysRemaining = Math.max(
		0,
		Math.ceil(
			(currentHouse.calculatedEndDate.getTime() - currentTime.getTime()) /
				(1000 * 60 * 60 * 24),
		),
	);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer group">
					<SeasonProgress
						value={progress}
						progressColor="bg-indigo-600/40 dark:bg-indigo-500/40"
						bgColor="bg-indigo-50 dark:bg-indigo-950/20"
					>
						<div className="flex items-center justify-between gap-2 min-w-56 tracking-tight">
							<div className="flex items-center gap-2">
								<div className="relative">
									<Moon className="h-4 w-4 text-indigo-700 dark:text-indigo-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] group-hover:rotate-12 transition-transform duration-500" />
									<Sparkles className="h-2 w-2 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
								</div>
								<div className="flex flex-col">
									<span className="text-[10px] uppercase font-black text-indigo-400/70 dark:text-indigo-500/70 -mb-1 leading-none">
										{currentHouse.englishPeriod}
									</span>
									<span className="text-xs font-bold text-indigo-900 dark:text-indigo-100 drop-shadow-sm">
										{currentHouse.englishName}
									</span>
								</div>
							</div>
							<div className="flex flex-col items-end">
								<span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
									{Math.round(progress)}%
								</span>
								<span className="text-[9px] font-medium text-indigo-400 dark:text-indigo-500 leading-none">
									House {currentHouse.id}
								</span>
							</div>
						</div>
					</SeasonProgress>
				</div>
			</TooltipTrigger>
			<TooltipContent
				side="bottom"
				sideOffset={12}
				className="p-4 border-indigo-200 dark:border-indigo-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-xl"
			>
				<div className="flex flex-col gap-3 min-w-[200px]">
					<div className="flex items-center justify-between">
						<span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
							{currentHouse.house}
						</span>
						<span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/50">
							ID: {currentHouse.id}
						</span>
					</div>

					<div className="space-y-1.5 border-y border-indigo-100 dark:border-indigo-900/50 py-2">
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Period:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{currentHouse.englishPeriod} ({currentHouse.period})
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Interval:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{format(currentHouse.calculatedStartDate, "MMM d")} —{" "}
								{format(currentHouse.calculatedEndDate, "MMM d")}
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Duration:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{currentHouse.duration} days
							</span>
						</div>
						<div className="flex justify-between text-xs">
							<span className="text-muted-foreground">Zodiac:</span>
							<span className="font-semibold text-indigo-900 dark:text-indigo-100">
								{currentHouse.zodiacSign.join(", ")}
							</span>
						</div>
					</div>

					<p className="text-[11px] leading-relaxed italic text-muted-foreground text-center px-2">
						"{currentHouse.description}"
					</p>

					<div className="pt-1 flex items-center justify-center gap-2">
						<div className="h-1 w-1 rounded-full bg-indigo-400 animate-ping" />
						<span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
							{daysRemaining} Days Remaining
						</span>
					</div>
				</div>
			</TooltipContent>
		</Tooltip>
	);
}
