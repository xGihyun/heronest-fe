<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner/index";
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "./sidebar.svelte";
	import {
		getAuthContext,
		setAuthContext
	} from "$lib/user/auth/context.svelte";

	let { data, children } = $props();

	setAuthContext({
		user: data.user,
		session: data.session
	});

	const authContext = getAuthContext();
</script>

<Toaster closeButton richColors />

{#if authContext.user}
	<Sidebar.Provider>
		<AppSidebar user={authContext.user} />

		<div class="flex w-full flex-col">
			<header class="p-5">
				<Sidebar.Trigger />
			</header>

			<main>
				{@render children()}
			</main>
		</div>
	</Sidebar.Provider>
{:else}
	<main class="h-svh">
		<div class="h-full w-full px-5 py-5">
			{@render children()}
		</div>
	</main>
{/if}
