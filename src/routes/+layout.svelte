<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner/index";
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "./sidebar.svelte";
	import { setUserContext } from "$lib/user/context";

	let { data, children } = $props();

	// TODO: Handle `null` value

	if (data.user) {
		setUserContext(data.user);
	}
</script>

<Toaster closeButton richColors />

<Sidebar.Provider>
	{#if data.user}
		<AppSidebar />
	{/if}
	<main class="flex min-h-svh w-full flex-col">
		{#if data.user}
			<Sidebar.Trigger />
		{/if}
		<div class="h-full w-full px-5 py-5">
			{@render children()}
		</div>
	</main>
</Sidebar.Provider>
