<script lang="ts">
	import { columns } from "./columns";
	import DataTable from "./data-table.svelte";
	import Actions from "./actions.svelte";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-lg">
	<h1 class="mb-4 font-inter-bold text-3xl">Venues</h1>

	<Actions form={data.form} />
	<DataTable data={data.venues} {columns} user={data.user} />
</div>
