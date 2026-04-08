import { createFileRoute } from "@tanstack/react-router";
import { ContinuousCalendar } from "@/components/ContinuousCalendar";

export const Route = createFileRoute("/ContinuousCalendar")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<div className="glass min-h-[600px] flex-1 rounded-3xl md:min-h-min overflow-hidden min-w-0 shadow-2xl shadow-primary/10">
				<ContinuousCalendar
					onClick={(day, month, year) => {
						// Future: Open event/holiday modal for selected date
						console.log(`Clicked: ${month + 1}/${day}/${year}`);
					}}
				/>
			</div>
		</div>
	);
}
