<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import { DateFormatter } from "@internationalized/date";
	import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { Separator } from "$lib/components/ui/separator";

	let { data } = $props();

	const df = new DateFormatter("en-US", {
		dateStyle: "medium"
	});

	let selectedEventId = $state(data.events[0].event_id || "");
</script>

<div class="space-y-4">
	<div>
		<h1 class="mb-1 font-inter-bold text-2xl">Events</h1>

		<RadioGroup.Root
			class="grid grid-cols-2 gap-2 lg:grid-cols-3"
			bind:value={selectedEventId}
		>
			{#each data.events as event (event.event_id)}
				<Label for={event.event_id}>
					<RadioGroup.Item
						value={event.event_id}
						id={event.event_id}
						class="peer"
						hidden
					/>
					<div
						class="rounded-lg
                        border-4
                        border-transparent peer-data-[state=checked]:bg-accent"
					>
						<AspectRatio
							ratio={16 / 9}
							class="flex w-full items-end overflow-hidden rounded-md
                            shadow"
						>
							<img
								src={event.image_url ? `/storage/${event.image_url}` : null}
								alt={event.name}
								class="absolute object-cover"
							/>
							<div
								class="relative w-full space-y-1
                            bg-neutral-900 px-3 py-2 text-primary-foreground"
							>
								<h1 class="font-inter-bold text-lg">
									{event.name}
								</h1>
								<p class="text-primary-foreground/75">
									{df.formatRange(
										new Date(event.start_at),
										new Date(event.end_at)
									)}
									•
									{event.venue.name}
								</p>
							</div>
						</AspectRatio>
					</div>
				</Label>
			{/each}
		</RadioGroup.Root>
	</div>

    <Separator />

	<h1 class="mb-1 font-inter-bold text-2xl">Reservations</h1>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Ticket</Table.Head>
				<Table.Head>Reserved At</Table.Head>
				<Table.Head>Venue</Table.Head>
				<Table.Head>Event</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.tickets as ticket (ticket.ticket_id)}
				<Table.Row>
					<Table.Cell>{ticket.ticket_number}</Table.Cell>
					<Table.Cell>
						{df.format(new Date(ticket.created_at))}
					</Table.Cell>
					<Table.Cell>{ticket.venue.name}</Table.Cell>
					<Table.Cell>{ticket.event.name}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
