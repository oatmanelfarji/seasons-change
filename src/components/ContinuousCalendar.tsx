/**
 * ContinuousCalendar Component
 *
 * A scrollable year-view calendar that displays all 12 months continuously.
 * Features:
 * - Displays entire year in a continuous scrollable view
 * - Month quick-navigation via dropdown
 * - "Today" button for instant navigation to current date
 * - Year navigation with prev/next buttons
 * - IntersectionObserver to track visible month while scrolling
 * - Keyboard accessible (Enter/Space to select dates)
 * - Dark/light mode support via CSS variables
 *
 * Future: Will support displaying events and holidays on each day cell.
 *
 * @example
 * <ContinuousCalendar
 *   onClick={(day, month, year) => console.log(`Selected: ${month+1}/${day}/${year}`)}
 * />
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import seasonStartData from "@/data/season-start.json";
import { useCountry } from "@/lib/country-context";
import { getHemisphere } from "@/lib/location-utils";
import { cn } from "@/lib/utils";

// Day labels for the calendar header row
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Month names for display and dropdown options
const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

interface ContinuousCalendarProps {
	/** Callback fired when a day cell is clicked. Receives day (1-31), month (0-11), and year. */
	onClick?: (day: number, month: number, year: number) => void;
}

export function ContinuousCalendar({ onClick }: ContinuousCalendarProps) {
	const [mounted, setMounted] = useState(false);
	const { selectedCountry } = useCountry();

	useEffect(() => {
		setMounted(true);
	}, []);

	const today = useMemo(() => new Date(), []);

	// Determine hemisphere for correct seasonal labeling
	const hemisphere = useMemo(() => {
		if (!selectedCountry) {
			return "northern";
		}
		return getHemisphere(selectedCountry.latitude);
	}, [selectedCountry]);

	// Create seasonal data for mappings and color ranges
	const seasonalData = useMemo(() => {
		const startsMap: Record<string, { title: string; seasonName: string }> = {};

		// Process sorted events for range calculation
		const events = [...seasonStartData]
			.map((item) => {
				const dateStr = item.startTime.split("T")[0];
				let baseSeason = "spring";
				if (item.title.toLowerCase().includes("summer")) {
					baseSeason = "summer";
				} else if (item.title.toLowerCase().includes("autumn")) {
					baseSeason = "autumn";
				} else if (item.title.toLowerCase().includes("winter")) {
					baseSeason = "winter";
				}

				let seasonName = baseSeason;
				if (hemisphere === "southern") {
					const swaps: Record<string, string> = {
						spring: "autumn",
						summer: "winter",
						autumn: "spring",
						winter: "summer",
					};
					seasonName = swaps[baseSeason] || baseSeason;
				}

				return { dateStr, seasonName };
			})
			.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

		// Populate starts map for the badges
		for (const event of events) {
			startsMap[event.dateStr] = {
				title: `${event.seasonName.charAt(0).toUpperCase()}${event.seasonName.slice(1)} Starts`,
				seasonName: event.seasonName,
			};
		}

		return { startsMap, events };
	}, [hemisphere]);

	/**
	 * Helper to get the season name for a specific date string (YYYY-MM-DD)
	 */
	const getSeasonForDate = useCallback(
		(dateStr: string) => {
			const events = seasonalData.events;
			if (events.length === 0) return "spring";

			// Find the latest event that is on or before the given date
			let foundSeason = events[0].seasonName;
			for (const event of events) {
				if (event.dateStr <= dateStr) {
					foundSeason = event.seasonName;
				} else {
					// Events are sorted, so we can stop once we pass the target date
					break;
				}
			}
			return foundSeason;
		},
		[seasonalData],
	);

	// Refs to each day cell for scroll targeting and IntersectionObserver
	const dayRefs = useRef<(HTMLElement | null)[]>([]);

	// Track if initial scroll to today has been done
	const hasScrolledToToday = useRef(false);

	// Currently displayed year
	const [year, setYear] = useState<number>(new Date().getFullYear());

	// Currently visible/selected month (updated by IntersectionObserver)
	const [selectedMonth, setSelectedMonth] = useState<number>(
		new Date().getMonth(),
	);

	// Pending scroll target - used when year changes and we need to wait for re-render
	const [pendingScroll, setPendingScroll] = useState<{
		month: number;
		day: number;
	} | null>(null);

	// Generate dropdown options from month names
	const monthOptions = monthNames.map((month, index) => ({
		name: month,
		value: `${index}`,
	}));

	/**
	 * Smoothly scrolls the calendar to bring a specific day into view.
	 * Uses different scroll targets depending on whether calendar is in a container or full page.
	 *
	 * @param monthIndex - The month to scroll to (0-11)
	 * @param dayIndex - The day of the month to scroll to (1-31)
	 */
	const scrollToDay = useCallback((monthIndex: number, dayIndex: number) => {
		// Find the day cell element by matching data attributes
		const targetDayIndex = dayRefs.current.findIndex(
			(ref) =>
				ref &&
				ref.getAttribute("data-month") === `${monthIndex}` &&
				ref.getAttribute("data-day") === `${dayIndex}`,
		);

		const targetElement = dayRefs.current[targetDayIndex];

		if (targetDayIndex !== -1 && targetElement) {
			const container = document.querySelector(".calendar-container");
			const elementRect = targetElement.getBoundingClientRect();

			// Adjust scroll offset based on screen size (2xl breakpoint = 1536px)
			const is2xl = window.matchMedia("(min-width: 1536px)").matches;
			const offsetFactor = is2xl ? 3 : 2.5;

			if (container) {
				// Scroll within the calendar container
				const containerRect = container.getBoundingClientRect();
				const offset =
					elementRect.top -
					containerRect.top -
					containerRect.height / offsetFactor +
					elementRect.height / 2;

				container.scrollTo({
					top: container.scrollTop + offset,
					behavior: "smooth",
				});
			} else {
				// Scroll the full page (fallback)
				const offset =
					window.scrollY +
					elementRect.top -
					window.innerHeight / offsetFactor +
					elementRect.height / 2;

				window.scrollTo({
					top: offset,
					behavior: "smooth",
				});
			}
		}
	}, []);

	// Year navigation handlers
	const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
	const handleNextYear = () => setYear((prevYear) => prevYear + 1);

	/**
	 * Handles month dropdown change - updates selection and scrolls to first day of month
	 */
	const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const monthIndex = Number.parseInt(event.target.value, 10);
		setSelectedMonth(monthIndex);
		// Use setTimeout to ensure the scroll happens after any potential re-render
		setTimeout(() => scrollToDay(monthIndex, 1), 50);
	};

	/**
	 * Handles "Today" button - sets year to current and scrolls to today's date
	 */
	const handleTodayClick = () => {
		const currentYear = today.getFullYear();
		const currentMonth = today.getMonth();
		const currentDay = today.getDate();

		if (year !== currentYear) {
			// Year is different - set pending scroll and change year
			// The scroll will happen in useEffect after re-render
			setPendingScroll({ month: currentMonth, day: currentDay });
			setYear(currentYear);
		} else {
			// Same year - scroll immediately
			scrollToDay(currentMonth, currentDay);
		}
	};

	/**
	 * Handles day cell click - normalizes month for padding days from previous year
	 * Padding days have month = -1, which maps to December of previous year
	 */
	const handleDayClick = useCallback(
		(day: number, month: number, clickedYear: number) => {
			if (!onClick) {
				return;
			}
			if (month < 0) {
				// Padding days from previous year's December
				onClick(day, 11, clickedYear - 1);
			} else {
				onClick(day, month, clickedYear);
			}
		},
		[onClick],
	);

	/**
	 * Generates the calendar grid - memoized to only rebuild when year or onClick changes.
	 * Creates a continuous grid of all days in the year, organized into weeks.
	 */
	const generateCalendar = useMemo(() => {
		const currentDate = new Date();

		/**
		 * Generates array of all days to display for the year.
		 * Includes padding days at start/end to complete the first and last weeks.
		 */
		const daysInYear = (): { month: number; day: number; key: string }[] => {
			const days: { month: number; day: number; key: string }[] = [];

			// Get what day of week January 1st falls on (0=Sun, 6=Sat)
			const startDayOfWeek = new Date(year, 0, 1).getDay();

			// Add padding days from previous December to start the first week
			// (only if year doesn't start on Saturday)
			if (startDayOfWeek < 6) {
				for (let i = 0; i < startDayOfWeek; i++) {
					// month = -1 indicates these are from previous year
					const day = 32 - startDayOfWeek + i;
					days.push({
						month: -1,
						day,
						key: `padding-start-${day}`,
					});
				}
			}

			// Add all days of each month in the year
			for (let month = 0; month < 12; month++) {
				// Get number of days in this month (day 0 of next month = last day of this month)
				const daysInMonth = new Date(year, month + 1, 0).getDate();

				for (let day = 1; day <= daysInMonth; day++) {
					days.push({ month, day, key: `month-${month}-${day}` });
				}
			}

			// Pad the last week to complete a full row of 7 days
			const lastWeekDayCount = days.length % 7;
			if (lastWeekDayCount > 0) {
				const extraDaysNeeded = 7 - lastWeekDayCount;
				for (let day = 1; day <= extraDaysNeeded; day++) {
					days.push({
						month: 0,
						day,
						key: `padding-end-${day}`,
					}); // Show as January of next year
				}
			}

			return days;
		};

		const calendarDays = daysInYear();

		// Group days into weeks (arrays of 7 days each)
		const calendarWeeks = [];
		for (let i = 0; i < calendarDays.length; i += 7) {
			calendarWeeks.push(calendarDays.slice(i, i + 7));
		}

		// Build the calendar grid JSX
		const calendar = calendarWeeks.map((week, weekIndex) => (
			<div
				className="flex w-full gap-1 sm:gap-2"
				key={`week-${year}-${week[0].key}`}
			>
				{week.map(({ month, day, key: dayKey }, dayIndex) => {
					const index = weekIndex * 7 + dayIndex;

					// Check if this is the first day of a new month (to show month label)
					const isNewMonth =
						index === 0 || calendarDays[index - 1].month !== month;

					// Check if this day is today (for highlighting)
					const isToday =
						currentDate.getMonth() === month &&
						currentDate.getDate() === day &&
						currentDate.getFullYear() === year;

					// Check if this day is a season start day
					const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
					const seasonStart = seasonalData.startsMap[dateStr];
					const daySeason = getSeasonForDate(dateStr);

					return (
						// Day cell container
						<button
							type="button"
							key={dayKey}
							ref={(el) => {
								dayRefs.current[index] = el;
							}}
							data-month={month}
							data-day={day}
							onClick={() => handleDayClick(day, month, year)}
							className={cn(
								// Base styles: responsive sizing with aspect ratio
								"relative z-10 group aspect-square w-full grow cursor-pointer rounded-xl border bg-transparent p-0 text-left font-medium transition-all duration-300",
								// Hover & Focus state: highlight, scale, and add depth
								"hover:z-20 hover:border-primary hover:scale-[1.02] hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/5",
								"focus:z-20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50",
								// Responsive adjustments
								"sm:rounded-2xl sm:border-2 lg:rounded-3xl",
								// Seasonal highlighting for all days
								`theme-${daySeason}`,
								// Subtle background for the entire season
								"bg-primary/2",
								// Pronounced background/border for start days
								seasonStart &&
									"border-primary/40 bg-primary/5 shadow-inner shadow-primary/5",
							)}
						>
							{/* Day number badge */}
							<span
								className={cn(
									"absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs",
									"sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base",
									// Today gets primary color background
									isToday && "bg-primary font-semibold text-primary-foreground",
									// Padding days (from prev year) are muted
									month < 0 ? "text-muted-foreground" : "text-foreground",
								)}
							>
								{day}
							</span>

							{/* Season indicator badge */}
							{seasonStart && (
								<div
									className={cn(
										"absolute right-1 bottom-1 flex items-center justify-center gap-1 rounded-full px-1.5 py-0.5 text-[6px] font-bold uppercase tracking-tight text-primary-foreground sm:right-2 sm:bottom-2 sm:px-2 sm:py-1 sm:text-[10px] lg:scale-110",
										`theme-${seasonStart.seasonName} bg-primary shadow-sm`,
									)}
								>
									<span className="hidden sm:inline">
										{seasonStart.title.split(" ")[0]}
									</span>
									<span className="sm:hidden">
										{seasonStart.title.split(" ")[0]}
									</span>
								</div>
							)}

							{/* Month label - shown on first day of each month */}
							{isNewMonth && (
								<span className="absolute bottom-0.5 left-0 w-full truncate px-1.5 text-sm font-semibold text-muted-foreground/50 sm:bottom-0 sm:text-base lg:bottom-2.5 lg:left-3.5 lg:-mb-1 lg:w-fit lg:px-0 lg:text-lg 2xl:mb-[-4px] 2xl:text-xl">
									{monthNames[month]}
								</span>
							)}

							{/* Add event button - appears on hover (placeholder for future functionality) */}
							{!seasonStart && (
								<span className="absolute right-2 top-2 rounded-full opacity-0 transition-all group-hover:opacity-100">
									<svg
										className="size-8 scale-90 text-primary transition-all hover:scale-100 group-focus:scale-100"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											fillRule="evenodd"
											d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
							)}
						</button>
					);
				})}
			</div>
		));

		return calendar;
	}, [year, handleDayClick, seasonalData, getSeasonForDate]);

	/**
	 * IntersectionObserver effect - tracks which month is currently visible
	 * Observes the 15th day of each month as a proxy for month visibility.
	 * Updates the month dropdown to match the visible month while scrolling.
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: year trigger is needed to re-attach observers to new DOM elements after year change
	useEffect(() => {
		const calendarContainer = document.querySelector(".calendar-container");

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const month = Number.parseInt(
							entry.target.getAttribute("data-month") || "0",
							10,
						);
						setSelectedMonth(month);
					}
				}
			},
			{
				root: calendarContainer,
				// Trigger when element enters the top 25% of visible area
				rootMargin: "-75% 0px -25% 0px",
				threshold: 0,
			},
		);

		// Observe only the 15th of each month as a representative day
		for (const ref of dayRefs.current) {
			if (ref && ref.getAttribute("data-day") === "15") {
				observer.observe(ref);
			}
		}

		return () => {
			observer.disconnect();
		};
	}, [year]);

	/**
	 * Initial scroll to today's date when calendar first loads
	 */
	useEffect(() => {
		if (!hasScrolledToToday.current && dayRefs.current.length > 0) {
			const now = new Date();
			// Small delay to ensure DOM is fully rendered
			const timer = setTimeout(() => {
				scrollToDay(now.getMonth(), now.getDate());
				hasScrolledToToday.current = true;
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [scrollToDay]);

	/**
	 * Handle pending scroll after year change
	 * When year changes, we need to wait for re-render before scrolling
	 */
	useEffect(() => {
		if (pendingScroll) {
			// Small delay to ensure DOM is updated with new year's calendar
			const timer = setTimeout(() => {
				scrollToDay(pendingScroll.month, pendingScroll.day);
				setPendingScroll(null);
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [pendingScroll, scrollToDay]);

	if (!mounted) {
		return (
			<div className="w-full h-full bg-card animate-pulse rounded-t-2xl" />
		);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// RENDER
	// ─────────────────────────────────────────────────────────────────────────

	return (
		<div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-card pb-10 text-foreground shadow-xl">
			{/* Sticky header with controls */}
			<div className="sticky -top-px z-50 w-full rounded-t-2xl bg-card px-5 pt-7 sm:px-8 sm:pt-8">
				{/* Top toolbar: month select, today button, add event, year nav */}
				<div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
					{/* Left side: Month dropdown + action buttons */}
					<div className="flex flex-wrap gap-2 sm:gap-3">
						<MonthSelect
							name="month"
							value={`${selectedMonth}`}
							options={monthOptions}
							onChange={handleMonthChange}
						/>
						<button
							onClick={handleTodayClick}
							type="button"
							className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted lg:px-5 lg:py-2.5"
						>
							Today
						</button>
						{/* Placeholder button for future event creation */}
						<button
							type="button"
							className="whitespace-nowrap rounded-lg bg-linear-to-r from-primary to-accent px-3 py-1.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/30 sm:rounded-xl lg:px-5 lg:py-2.5"
						>
							+ Add Event
						</button>
					</div>

					{/* Right side: Year navigation */}
					<div className="flex w-fit items-center justify-between">
						{/* Previous year button */}
						<button
							onClick={handlePrevYear}
							type="button"
							className="rounded-full border border-border p-1 transition-colors hover:bg-muted sm:p-2"
						>
							<svg
								className="size-5 text-foreground"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m15 19-7-7 7-7"
								/>
							</svg>
						</button>

						{/* Current year display */}
						<h1 className="min-w-16 text-center text-lg font-semibold sm:min-w-20 sm:text-xl">
							{year}
						</h1>

						{/* Next year button */}
						<button
							onClick={handleNextYear}
							type="button"
							className="rounded-full border border-border p-1 transition-colors hover:bg-muted sm:p-2"
						>
							<svg
								className="size-5 text-foreground"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="m9 5 7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Day of week header row */}
				<div className="grid w-full grid-cols-7 justify-between text-muted-foreground">
					{daysOfWeek.map((day) => (
						<div
							key={day}
							className="w-full border-b border-border py-2 text-center font-semibold"
						>
							{day}
						</div>
					))}
				</div>
			</div>

			{/* Calendar grid - all weeks/days */}
			<div className="flex flex-col gap-1 sm:gap-2 w-full px-5 pt-4 sm:px-8 sm:pt-6">
				{generateCalendar}
			</div>
		</div>
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// MonthSelect Component
// ─────────────────────────────────────────────────────────────────────────────

interface MonthSelectProps {
	/** HTML name attribute for the select element */
	name: string;
	/** Currently selected month value (0-11 as string) */
	value: string;
	/** Optional label text displayed above the select */
	label?: string;
	/** Array of month options with name (display) and value (index) */
	options: { name: string; value: string }[];
	/** Callback fired when selection changes */
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Custom styled select dropdown for month selection.
 * Includes a custom dropdown arrow icon overlay.
 */
function MonthSelect({
	name,
	value,
	label,
	options = [],
	onChange,
	className,
}: MonthSelectProps) {
	return (
		<div className={cn("relative", className)}>
			{/* Optional label */}
			{label && (
				<label
					htmlFor={name}
					className="mb-2 block font-medium text-foreground"
				>
					{label}
				</label>
			)}

			{/* Native select element with custom styling */}
			<select
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				className="cursor-pointer rounded-lg border border-border bg-card py-1.5 pl-2 pr-6 text-sm font-medium text-foreground hover:bg-muted sm:rounded-xl sm:py-2.5 sm:pl-3 sm:pr-8"
				required
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.name}
					</option>
				))}
			</select>

			{/* Custom dropdown arrow icon (overlays native arrow) */}
			<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-1 sm:pr-2">
				<svg
					className="size-5 text-muted-foreground"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
						clipRule="evenodd"
					/>
				</svg>
			</span>
		</div>
	);
}
