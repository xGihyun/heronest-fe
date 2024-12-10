<script lang="ts">
	import { columns } from "./columns";
	import Actions from "./actions.svelte";
	import { DataTable } from "$lib/components/ui/data-table";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-lg">
	<h1 class="font-inter-bold text-3xl mb-4">Events</h1>

	<Actions form={data.form} venues={data.venues} />
	<DataTable data={data.events} {columns} />
</div>
