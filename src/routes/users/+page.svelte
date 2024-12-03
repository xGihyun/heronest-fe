<script lang="ts">
	import Actions from "./actions.svelte";
	import { columns } from "./columns";
	import DataTable from "./data-table.svelte";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-lg">
	<h1 class="font-inter-bold text-3xl mb-4">Users</h1>

    <Actions form={data.form} />
	<DataTable data={data.venues} {columns} />
</div>
