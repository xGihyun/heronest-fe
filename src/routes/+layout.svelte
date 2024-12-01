<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner/index";
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "./sidebar.svelte";

	let { data, children } = $props();
</script>

<Toaster closeButton richColors />

<Sidebar.Provider>
	{#if data.user}
		<AppSidebar user={data.user} />
	{/if}
	<main class="flex h-svh w-full flex-col">
		<Sidebar.Trigger />
		<div class="h-full w-full px-5 py-5">
			{@render children()}
		</div>
	</main>
</Sidebar.Provider>
