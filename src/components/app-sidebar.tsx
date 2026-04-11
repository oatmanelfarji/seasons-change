"use client";

import { Compass, Sun } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "Seasons Change",
			logo: Sun,
			plan: "Explorer",
		},
	],
	navMain: [
		{
			title: "Explore",
			url: "#",
			icon: Compass,
			isActive: true,
			items: [
				{
					title: "Home",
					url: "/",
				},
				{
					title: "Holidays",
					url: "/holidays",
				},
				{
					title: "Continuous Calendar",
					url: "/ContinuousCalendar",
				},
				{
					title: "Country Info",
					url: "/CountriesInfo",
				},
				{
					title: "Seasons",
					url: "/seasons",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
