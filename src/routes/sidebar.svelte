<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { EventIcon, HomeIcon, LocationIcon, UsersIcon } from "$lib/icons";
	import { UserRole } from "$lib/user/types";
	import type { Component } from "svelte";
	import type { SVGAttributes } from "svelte/elements";
	import ChevronUp from "lucide-svelte/icons/chevron-up";
	import { getUserContext } from "$lib/user/context";
	import { formatUserName } from "$lib/user/utils";

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

	async function logout(): Promise<void> {
		await fetch(`/api/logout`, { method: "POST" });

		await invalidateAll();
	}

	const user = getUserContext();
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<h1 class="font-inter-bold text-2xl">Heronest</h1>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{@render sidebarItems(ROUTES)}

					{#if user.role === UserRole.Admin}
						{@render sidebarItems(ADMIN_ROUTES)}
					{/if}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child(item)}
							<Sidebar.MenuButton
								{...item.props}
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar.Root>
									<Avatar.Image src={user.avatar_url} alt={user.email} />
									<Avatar.Fallback class="bg-background">
										{@const initials = `${user.first_name[0]}${user.last_name[0]}`}
										{initials}
									</Avatar.Fallback>
								</Avatar.Root>

								<span class="text-base">
									{formatUserName(user)}
								</span>
								<ChevronUp class="ml-auto" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						side="top"
						class="w-[--bits-dropdown-menu-anchor-width]"
					>
						<DropdownMenu.Item>
							{#snippet child(item)}
								<a href="/profile" {...item.props}> Profile </a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={logout}>
							<span>Sign out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
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
