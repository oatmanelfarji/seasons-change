import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, Info, Tag } from "lucide-react";
import { getHolidaysByCountry } from "@/db/queries";
import { type Holiday } from "@/db/schema";
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div
							key={i}
							className="h-48 rounded-3xl bg-muted/20 animate-pulse border border-border/50"
						/>
					))}
				</div>
			) : holidays && holidays.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{holidays.map((holiday: Holiday) => (
						<div
							key={holiday.id}
							className="group relative glass rounded-3xl p-6 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden border border-border/50"
						>
							<div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700 pointer-events-none" />

							<div className="relative z-10 flex flex-col h-full gap-4">
								<div className="flex items-start justify-between gap-4">
									<div className="p-3 rounded-2xl bg-primary/10 text-primary">
										<Calendar className="w-6 h-6" />
									</div>
									<div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold capitalize">
										{holiday.type || "Holiday"}
									</div>
								</div>

								<div className="flex flex-col gap-1">
									<h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
										{holiday.name}
									</h3>
									{holiday.localName && (
										<p className="text-sm font-medium text-accent italic">
											{holiday.localName}
										</p>
									)}
								</div>

								<div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border/50">
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
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center p-12 glass rounded-3xl border border-dashed border-border/50 min-h-[400px]">
					<div className="p-6 rounded-full bg-muted/10 mb-4">
						<Tag className="w-12 h-12 text-muted-foreground opacity-50" />
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
