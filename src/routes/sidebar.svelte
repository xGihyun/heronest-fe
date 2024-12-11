<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import {
		EventIcon,
		HomeIcon,
		LocationIcon,
		UsersIcon,
		WingIcon
	} from "$lib/icons";
	import { UserRole, type User } from "$lib/user/types";
	import type { Component } from "svelte";
	import type { SVGAttributes } from "svelte/elements";
	import ChevronUp from "lucide-svelte/icons/chevron-up";
	import { getAuthContext } from "$lib/user/auth/context.svelte";
	import { formatUserName, getUserInitials } from "$lib/user/utils";

	type Props = {
		user: User;
	};

	type Route = {
		name: string;
		path: string;
		icon: Component<SVGAttributes<SVGSVGElement>>;
	};

	let props: Props = $props();

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

	const authContext = getAuthContext();

	async function logout(): Promise<void> {
		await fetch(`/api/logout`, { method: "POST" });

		authContext.user = null;
		authContext.session = null;

		await invalidateAll();
	}
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<a href="/" class="flex gap-2 p-2">
					<WingIcon class="size-6 text-accent" />
					<h1 class="font-inter-bold text-2xl">Heronest</h1>
				</a>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
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
									<Avatar.Image
										src={props.user.avatar_url}
										alt={props.user.email}
									/>
									<Avatar.Fallback class="bg-background text-foreground">
										{getUserInitials(props.user)}
									</Avatar.Fallback>
								</Avatar.Root>

								<span class="text-base">
									{formatUserName(props.user)}
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
