<script lang="ts">
	import { columns } from "./columns";
	import DataTable from "./data-table.svelte";
	import EventForm from "./event-form.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { buttonVariants } from "$lib/components/ui/button";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";

	let { data } = $props();

	const formState = getFormState();
</script>

<Dialog.Root
	bind:open={formState.isOpen}
	onOpenChange={(open) => {
		if (!open) {
			formState.reset();
		}
	}}
>
	<Dialog.Trigger class={buttonVariants({ variant: "default" })}>
		Create
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{#if formState.action === FormAction.Create}
					Create
				{:else}
					Edit
				{/if}
				Event
			</Dialog.Title>
			<Dialog.Description>Enter the event's details below.</Dialog.Description>
		</Dialog.Header>

		<EventForm form={data.form} venues={data.venues} />
	</Dialog.Content>
</Dialog.Root>

<DataTable data={data.events} {columns} />
