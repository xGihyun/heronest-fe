<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import type { Event } from "$lib/map/event/types";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";
	import { EditIcon, FileDownloadIcon } from "$lib/icons";
	import { generateTicketsCsv } from "$lib/ticket/spreadsheet";
	import { getTickets } from "$lib/ticket/requests";

	type Props = {
		event: Event;
	};

	let props: Props = $props();

	const formState = getFormState();

	async function getReservationReportByEvent(event: Event) {
		const tickets = await getTickets({ eventId: event.event_id });

        console.log(tickets)

		await generateTicketsCsv(tickets.data, event);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
			>
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item
			onclick={() => {
				formState.action = FormAction.Edit;
				formState.data = {
					event_id: props.event.event_id,
					name: props.event.name,
					start_at: new Date(props.event.start_at),
					end_at: new Date(props.event.end_at),
					description: props.event.description,
					venue_id: props.event.venue.venue_id,
					image: null,
					allow_visitors: props.event.allow_visitors,
					image_url: props.event.image_url
				};
				formState.isOpen = true;
			}}
		>
			<EditIcon class="size-4" />
			Edit
		</DropdownMenu.Item>

		<DropdownMenu.Item onclick={() => getReservationReportByEvent(props.event)}>
			<FileDownloadIcon class="size-4" />
			Reservations
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
