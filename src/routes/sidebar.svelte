<script lang="ts">
	import Calendar from "lucide-svelte/icons/calendar";
	import House from "lucide-svelte/icons/house";
	import MapPinned from "lucide-svelte/icons/map-pinned";
	import Users from "lucide-svelte/icons/users";
	import Settings from "lucide-svelte/icons/settings";
	import * as Sidebar from "$lib/components/ui/sidebar";

	const items = [
		{
			title: "Home",
			url: "/",
			icon: House
		},
		{
			title: "Map",
			url: "/map",
			icon: MapPinned
		},
		{
			title: "Events",
			url: "/events",
			icon: Calendar
		},
		{
			title: "Users",
			url: "/users",
			icon: Users
		},
		{
			title: "Settings",
			url: "#",
			icon: Settings
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
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
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
