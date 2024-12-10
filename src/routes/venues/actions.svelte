<script lang="ts">
	import { page } from "$app/stores";
	import { Input } from "$lib/components/ui/input";
	import { goto, invalidateAll } from "$app/navigation";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { FileDownloadIcon, PlusIcon, SearchIcon } from "$lib/icons";
	import { FormAction } from "$lib/types";
	import { getFormState } from "./state.svelte";
	import type { Infer, SuperValidated } from "sveltekit-superforms";
	import type { CreateVenueSchema } from "$lib/map/venue/schema";
	import VenueForm from "./venue-form.svelte";
	import { generateVenuesCsv } from "$lib/map/venue/spreadsheet";
	import { getVenues } from "$lib/map/venue/requests";

	type Props = {
		form: SuperValidated<Infer<typeof CreateVenueSchema>>;
	};
	let props: Props = $props();

	const formState = getFormState();
	let searchValue = $state("");

	async function search() {
		const params = $page.url.searchParams;

		params.set("name", searchValue);

		await goto(`?${params.toString()}`);
		await invalidateAll();
	}

	async function downloadVenues() {
		const venues = await getVenues();

		await generateVenuesCsv(venues.data);
	}
</script>

<Dialog.Root
	bind:open={formState.isOpen}
	onOpenChange={(open) => {
		if (!open) {
			formState.reset();
		}
	}}
>
	<div class="mb-2 flex justify-between gap-2">
		<div class="relative w-full max-w-sm">
			<Input
				class="peer w-full ps-9"
				type="search"
				placeholder="Enter a venue..."
				bind:value={searchValue}
				onkeypress={(e) => {
					if (e.key === "Enter") {
						search();
					}
				}}
			/>

			<div
				class="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50"
			>
				<SearchIcon class="size-4" />
			</div>
		</div>

		<div>
			<Button onclick={downloadVenues} variant="secondary">
				<FileDownloadIcon class="size-4" />
				Report
			</Button>
			<Dialog.Trigger class={buttonVariants({ variant: "default" })}>
				<PlusIcon class="size-4" />
				Create
			</Dialog.Trigger>
		</div>
	</div>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{#if formState.action === FormAction.Create}
					Create
				{:else}
					Edit
				{/if}
				Venue
			</Dialog.Title>
			<Dialog.Description>Enter the venue's details below.</Dialog.Description>
		</Dialog.Header>

		<VenueForm form={props.form} />
	</Dialog.Content>
</Dialog.Root>
