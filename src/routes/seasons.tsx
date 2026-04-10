import { createFileRoute } from "@tanstack/react-router";
import zodiacSigns from "../data/zodiac_sign.json";

export const Route = createFileRoute("/seasons")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-12 w-full max-w-6xl mx-auto p-4 md:p-8">
			{/* Seasons Grid */}
			<div className="grid grid-cols-4 h-32 rounded-xl overflow-hidden shadow-lg border border-zinc-800/50">
				<div className="bg-blue-500 text-zinc-900 flex items-center justify-center font-bold text-xl uppercase tracking-wider">
					<h1>winter</h1>
				</div>
				<div className="bg-green-500 text-zinc-900 flex items-center justify-center font-bold text-xl uppercase tracking-wider">
					<h1>spring</h1>
				</div>
				<div className="bg-yellow-500 text-zinc-900 flex items-center justify-center font-bold text-xl uppercase tracking-wider">
					<h1>summer</h1>
				</div>
				<div className="bg-orange-500 text-zinc-900 flex items-center justify-center font-bold text-xl uppercase tracking-wider">
					<h1>autumn</h1>
				</div>
			</div>

			{/* Zodiac Timeline */}
			<div className="w-full bg-zinc-900/50 p-6 md:p-10 rounded-2xl border border-zinc-800">
				<h2 className="text-2xl font-bold text-zinc-100 mb-8">
					Zodiac Signs Timeline
				</h2>

				<div className="w-full overflow-x-auto pb-6 scrollbar-hide">
					<div className="flex min-w-max items-center relative pt-8 pb-8 px-8">
						{/* Horizontal Timeline Line */}
						<div className="absolute left-0 right-0 h-[2px] bg-zinc-700 top-1/2 -translate-y-1/2 z-0 rounded-full"></div>

						{zodiacSigns.map((sign, index) => (
							<div
								key={sign.id}
								className="relative flex flex-col items-center w-36 h-56 shrink-0 z-10 group"
							>
								{/* Node Marker */}
								<div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-indigo-500 border-4 border-zinc-950 -translate-x-1/2 -translate-y-1/2 z-20 group-hover:scale-150 group-hover:bg-indigo-400 group-hover:border-zinc-900 transition-all duration-300"></div>

								{/* Content (Alternating layout) */}
								{index % 2 === 0 ? (
									<div className="absolute top-0 flex flex-col items-center text-center px-2 group-hover:-translate-y-2 transition-transform duration-300">
										<div className="bg-zinc-800/80 backdrop-blur-sm px-3 py-1 rounded-full mb-3 border border-zinc-700/50">
											<p className="text-xs font-medium text-indigo-300">
												{sign.startDate} - {sign.endDate}
											</p>
										</div>
										<h3 className="font-bold text-zinc-100 text-lg tracking-wide">
											{sign.name}
										</h3>
										<p className="text-sm font-medium text-zinc-400 mt-1">
											{sign.nameAr}
										</p>
									</div>
								) : (
									<div className="absolute bottom-0 flex flex-col items-center text-center px-2 group-hover:translate-y-2 transition-transform duration-300">
										<h3 className="font-bold text-zinc-100 text-lg tracking-wide">
											{sign.name}
										</h3>
										<p className="text-sm font-medium text-zinc-400 mb-3">
											{sign.nameAr}
										</p>
										<div className="bg-zinc-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-zinc-700/50">
											<p className="text-xs font-medium text-indigo-300">
												{sign.startDate} - {sign.endDate}
											</p>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
