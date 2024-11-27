<script lang="ts">
	import { columns } from "./columns";
	import DataTable from "./data-table.svelte";
	import CreateEventOccurenceForm from "./create-event-occurence-form.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { buttonVariants } from "$lib/components/ui/button";

	let { data } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "default" })}>
		Create Occurence
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Event Occurence</Dialog.Title>
			<Dialog.Description>Enter the event's details below.</Dialog.Description>
		</Dialog.Header>

		<CreateEventOccurenceForm form={data.form} />
	</Dialog.Content>
</Dialog.Root>

<DataTable data={data.events} {columns} />

