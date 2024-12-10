<script lang="ts">
	import Actions from "./actions.svelte";
	import { columns } from "./columns";
    import {DataTable} from "$lib/components/ui/data-table"

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-lg">
	<h1 class="font-inter-bold text-3xl mb-4">Users</h1>

    <Actions form={data.form} />
	<DataTable data={data.users} {columns} />
</div>
