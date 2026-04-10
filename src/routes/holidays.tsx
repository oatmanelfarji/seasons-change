import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, Info, Tag } from "lucide-react";
import { getHolidaysByCountry } from "@/db/queries";
import type { Holiday } from "@/db/schema";
import { useCountry } from "@/lib/country-context";

export const Route = createFileRoute("/holidays")({
	component: HolidaysPage,
});

function HolidaysPage() {
	const { countryCode, selectedCountry } = useCountry();

	const { data: holidays, isLoading } = useQuery({
		queryKey: ["holidays", countryCode],
		queryFn: () => getHolidaysByCountry({ data: countryCode }),
	});

	return (
		<div className="flex flex-1 flex-col gap-8 p-8 pt-0 stagger-in">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-primary to-accent bg-clip-text text-transparent italic">
					Holidays in {selectedCountry?.name || countryCode}
				</h1>
				<p className="text-muted-foreground text-lg">
					Explore upcoming national and religious celebrations.
				</p>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="h-48 rounded-xl bg-muted/20 animate-pulse border border-border/50"
							aria-hidden="true"
						/>
					))}
				</div>
			) : holidays && holidays.length > 0 ? (
				<ul
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
					aria-label="Holiday list"
				>
					{holidays.map((holiday: Holiday) => (
						<li
							key={holiday.id}
							aria-label={holiday.name}
							className="group card-surface-interactive p-5 overflow-hidden"
						>
							<div className="flex flex-col h-full gap-3">
								<div className="flex items-start justify-between gap-3">
									<div className="p-2.5 rounded-lg bg-primary/10 text-primary">
										<Calendar className="w-5 h-5" />
									</div>
									<div className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-semibold capitalize">
										{holiday.type || "Holiday"}
									</div>
								</div>

								<div className="flex flex-col gap-1">
									<h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
										{holiday.name}
									</h3>
									{holiday.localName && (
										<p className="text-sm font-medium text-accent italic">
											{holiday.localName}
										</p>
									)}
								</div>

								<div className="flex flex-col gap-2 mt-auto pt-3 border-t border-border/40">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Info className="w-4 h-4" />
										<span>
											{format(new Date(holiday.startDate), "MMMM do")}
										</span>
									</div>
									{holiday.description && (
										<p className="text-sm text-muted-foreground line-clamp-2">
											{holiday.description}
										</p>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div className="flex flex-col items-center justify-center p-12 card-surface border-dashed min-h-[400px]">
					<div className="p-5 rounded-xl bg-muted/10 mb-4">
						<Tag className="w-10 h-10 text-muted-foreground" />
					</div>
					<h2 className="text-xl font-semibold">No holidays found</h2>
					<p className="text-muted-foreground text-center max-w-sm mt-2">
						We couldn't find any holiday data for {selectedCountry?.name}. Try
						selecting another country or check back later.
					</p>
				</div>
			)}
		</div>
	);
}
