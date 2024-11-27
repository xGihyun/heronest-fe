<script lang="ts">
	import { page } from "$app/stores";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import {
		EventIcon,
		HomeIcon,
		LocationIcon,
		MapIcon,
		UsersIcon
	} from "$lib/icons";
	import type { Component } from "svelte";
	import type { SVGAttributes } from "svelte/elements";

	type Route = {
		name: string;
		path: string;
		icon: Component<SVGAttributes<SVGSVGElement>>
	}

	const ROUTES: Route[] = [
		{
			name: "Home",
			path: "/",
			icon: HomeIcon
		},
		{
			name: "Map",
			path: "/map",
			icon: MapIcon
		},
		{
			name: "Events",
			path: "/events",
			icon: EventIcon
		},
		{
			name: "Venues",
			path: "/venues",
			icon: LocationIcon
		},
		{
			name: "Users",
			path: "/users",
			icon: UsersIcon
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<h1 class="font-inter-bold">Heronest</h1>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each ROUTES as route (route.name)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton isActive={route.path === $page.url.pathname}>
								{#snippet child({ props })}
									<a href={route.path} {...props}>
										<route.icon class="size-6" />
										<span class="text-base">{route.name}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>Logout</Sidebar.Footer>
</Sidebar.Root>
