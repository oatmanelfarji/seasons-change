import { cn } from "@/lib/utils";

interface SeasonProgressProps {
	value: number;
	progressColor: string;
	bgColor: string;
	children: React.ReactNode;
}

export function SeasonProgress({
	value,
	progressColor,
	bgColor,
	children,
}: SeasonProgressProps) {
	const clampedValue = Math.min(Math.max(value, 0), 100);

	return (
		<div
			className={cn(
				"relative w-full h-10 rounded-2xl overflow-hidden border border-white/10 shadow-inner",
				bgColor,
			)}
		>
			{/* Progress indicator */}
			<div
				className={cn(
					"absolute inset-0 h-full transition-all duration-1000 ease-smooth shine-effect",
					progressColor,
				)}
				style={{ width: `${clampedValue}%` }}
			/>

			{/* Content overlay */}
			<div className="relative flex items-center px-4 h-full pointer-events-none z-10">
				{children}
			</div>
		</div>
	);
}
