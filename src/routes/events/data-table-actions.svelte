<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import type { Event } from "$lib/map/event/types";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";
	import { EditIcon, FileDownloadIcon } from "$lib/icons";
	import {
		generateTicketsCsv,
		getTicketBatches
	} from "$lib/ticket/spreadsheet";
	import { getTickets } from "$lib/ticket/requests";
	import { ApiResponseStatus } from "$lib/api/types";
	import { downloadFileFromUrl } from "$lib/utils";
	import { format } from "date-fns";
	import { toast } from "svelte-sonner";

	type Props = {
		event: Event;
	};

	let props: Props = $props();

	const formState = getFormState();

	async function getReservationReportByEvent(event: Event) {
		const tickets = await getTickets({ eventId: event.event_id });

		await generateTicketsCsv(tickets.data, event);
	}

	async function generateBatches() {
		let toastId: string | number = toast.loading(
			"Generating ticket batches..."
		);
		const batches = await getTicketBatches(props.event.event_id);

		console.log(batches);

		if (batches.status !== ApiResponseStatus.Success) {
			console.error(batches.message);
			toast.error(batches.message, { id: toastId });
			return;
		}

		try {
			const currentDate = format(new Date(), "yyyy-MM-dd - hh:mma");
			const fileName = `${props.event.name} - Tickets - ${currentDate}.zip`;
			await downloadFileFromUrl(
				`/storage/tickets/batches/${batches.data}`,
				fileName
			);

			toast.success("Successfully generated ticket batches.", { id: toastId });
		} catch (error) {
			console.error("Failed to generate ticket batches:", error);
		}
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

		<DropdownMenu.Separator />

		<DropdownMenu.Item onclick={() => getReservationReportByEvent(props.event)}>
			<FileDownloadIcon class="size-4" />
			Reservations
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={generateBatches}>
			<FileDownloadIcon class="size-4" />
			Tickets
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
