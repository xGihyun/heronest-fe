<script lang="ts">
	import { page } from "$app/stores";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { EventIcon, HomeIcon, LocationIcon, UsersIcon } from "$lib/icons";
	import { UserRole, type User } from "$lib/user/types";
	import type { Component } from "svelte";
	import type { SVGAttributes } from "svelte/elements";

	type Props = {
		user: User;
	};

	let props: Props = $props();

	type Route = {
		name: string;
		path: string;
		icon: Component<SVGAttributes<SVGSVGElement>>;
	};

	const ROUTES: Route[] = [
		{
			name: "Home",
			path: "/",
			icon: HomeIcon
		},
		{
			name: "Venues",
			path: "/venues",
			icon: LocationIcon
		}
	];

	const ADMIN_ROUTES: Route[] = [
		{
			name: "Events",
			path: "/events",
			icon: EventIcon
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
					{@render sidebarItems(ROUTES)}

					{#if props.user.role === UserRole.Admin}
						{@render sidebarItems(ADMIN_ROUTES)}
					{/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<a href="/profile">
		{props.user.first_name}
		{props.user.last_name}
	</a>
	<Sidebar.Footer>Logout</Sidebar.Footer>
</Sidebar.Root>

{#snippet sidebarItems(routes: Route[])}
	{#each routes as route (route.name)}
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
{/snippet}
