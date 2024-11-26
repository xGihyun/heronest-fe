<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner/index";
	import "../app.css";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "./sidebar.svelte";

	let { children } = $props();
</script>

<Toaster closeButton richColors />

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full h-[100svh] flex flex-col">
		<Sidebar.Trigger />
		<div class="px-5 py-5 w-full h-full">
			{@render children()}
		</div>
	</main>
</Sidebar.Provider>
