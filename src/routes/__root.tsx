import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
	useMatches,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { CountrySelector } from "@/components/country-selector";
import { ModeToggle } from "@/components/mode-toggle";
import NotFound from "@/components/NotFound";
import { SeasonThemeHandler } from "@/components/season-theme-handler";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CountryProvider, useCountry } from "@/lib/country-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { queryClient } from "../query-client";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "My Country Info",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
		scripts: [
			{
				children: `
          (function() {
            try {
              var storageKey = 'vite-ui-theme';
              var theme = localStorage.getItem(storageKey);
              var support = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
              var systemTheme = support ? 'dark' : 'light';
              
              var root = document.documentElement;
              root.classList.remove('light', 'dark');
              
              if (!theme || theme === 'system') {
                root.classList.add(systemTheme);
              } else {
                root.classList.add(theme);
              }
              
              // Apply seasonal theme from storage
              var seasonTheme = localStorage.getItem('season-theme');
              if (seasonTheme) {
                root.classList.add(seasonTheme);
              }
            } catch (e) {}
          })()
        `,
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
						<TooltipProvider>
							<CountryProvider>
								<SeasonThemeHandler />
								<div className="mesh-bg">
									<div className="mesh-circle mesh-circle-1" />
									<div className="mesh-circle mesh-circle-2" />
								</div>
								<SidebarProvider>
									<AppSidebar />
									<SidebarInset className="noise-bg bg-background/80">
										<RootHeader />
										{children}
									</SidebarInset>
								</SidebarProvider>
							</CountryProvider>
						</TooltipProvider>
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								{
									name: "React Query",
									render: <ReactQueryDevtoolsPanel />,
								},
							]}
						/>
						<Scripts />
					</ThemeProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}

function RootHeader() {
	const matches = useMatches();
	const { countryCode, setCountryCode } = useCountry();

	return (
		<header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 mb-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						{matches.map((match, index) => {
							const isLast = index === matches.length - 1;
							const label =
								match.pathname === "/"
									? "Home"
									: match.pathname.split("/").pop();
							return (
								<React.Fragment key={match.id}>
									<BreadcrumbItem className="hidden md:block">
										{isLast ? (
											<BreadcrumbPage className="capitalize">
												{label}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link to={match.pathname} className="capitalize">
													{label}
												</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && (
										<BreadcrumbSeparator className="hidden md:block" />
									)}
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex items-center gap-2 px-4">
				<CountrySelector value={countryCode} onChange={setCountryCode} />
				<ModeToggle />
			</div>
		</header>
	);
}
