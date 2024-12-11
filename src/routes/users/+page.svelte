<script lang="ts">
	import Actions from "./actions.svelte";
	import { columns } from "./columns";
	import { DataTable } from "$lib/components/ui/data-table";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-lg p-5">
	<h1 class="mb-2 font-inter-bold text-3xl">Users</h1>

	<Actions form={data.form} />
	<DataTable data={data.users} {columns} />
</div>
