import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
	useMatches,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
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
import { ThemeProvider } from "@/lib/theme-provider";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
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
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const matches = useMatches();
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<script
					dangerouslySetInnerHTML={{
						__html: `
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
					}}
				/>
			</head>
			<body>
				<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
					<SeasonThemeHandler />
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
																	<Link
																		to={match.pathname}
																		className="capitalize"
																	>
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
									<ModeToggle />
								</div>
							</header>
							{children}
						</SidebarInset>
					</SidebarProvider>
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
					<Scripts />
				</ThemeProvider>
			</body>
		</html>
	);
}
