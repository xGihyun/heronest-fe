<script lang="ts">
	import { columns } from "./columns";
	import DataTable from "./data-table.svelte";
	import CreateVenueForm from "./form.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { buttonVariants } from "$lib/components/ui/button";

	let { data } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "default" })}>
		Create
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Venue</Dialog.Title>
			<Dialog.Description>Enter the venue's details below.</Dialog.Description>
		</Dialog.Header>

		<CreateVenueForm form={data.form} />
	</Dialog.Content>
</Dialog.Root>

<DataTable data={data.venues} {columns} />
