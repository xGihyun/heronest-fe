<script lang="ts">
	import { columns } from "./columns";
	import DataTable from "./data-table.svelte";
	import EventForm from "./event-form.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { buttonVariants } from "$lib/components/ui/button";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";
	import Actions from "./actions.svelte";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-lg">
	<h1 class="font-inter-bold text-3xl mb-4">Events</h1>

	<Actions form={data.form} venues={data.venues} />
	<DataTable data={data.events} {columns} />
</div>
