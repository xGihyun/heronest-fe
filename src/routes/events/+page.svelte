<script lang="ts">
	import { columns } from "./columns";
	import Actions from "./actions.svelte";
	import { DataTable } from "$lib/components/ui/data-table";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-lg p-5">
	<h1 class="mb-2 font-inter-bold text-3xl">Events</h1>

	<Actions form={data.form} venues={data.venues} />
	<DataTable data={data.events} {columns} />
</div>
