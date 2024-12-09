<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { FileDownloadIcon } from "$lib/icons";
	import type { Ticket } from "$lib/ticket/types";
	import { getUserContext } from "$lib/user/context";
	import { UserRole } from "$lib/user/types";
	import { formatUserName } from "$lib/user/utils";
	import { DateFormatter } from "@internationalized/date";

	type Props = {
		tickets: Ticket[];
	};

	let props: Props = $props();

	const df = new DateFormatter("en-US", {
		dateStyle: "medium"
	});

	const user = getUserContext();
</script>

<h1 class="mb-1 font-inter-bold text-2xl">Reservations</h1>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Ticket No.</Table.Head>
				<Table.Head>Reserved At</Table.Head>
				{#if user.role === UserRole.Admin}
					<Table.Head>User</Table.Head>
				{/if}
				<Table.Head>Venue</Table.Head>
				<Table.Head>Event</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each props.tickets as ticket (ticket.ticket_id)}
				<Table.Row>
					<Table.Cell>
						<a
							href={`/storage/tickets/Ticket-${ticket.ticket_number}.pdf`}
							target="_blank"
							rel="noreferrer"
							class="flex items-center
                                gap-2 font-inter-semibold text-blue-800 underline"
						>
							<FileDownloadIcon class="size-4" />
							{ticket.ticket_number}
						</a>
					</Table.Cell>
					<Table.Cell>
						{df.format(new Date(ticket.reserved_at))}
					</Table.Cell>

					{#if user.role === UserRole.Admin}
						<Table.Cell>{formatUserName(ticket.reservation.user, "lf")}</Table.Cell>
					{/if}

					<Table.Cell>{ticket.reservation.venue.name}</Table.Cell>
					<Table.Cell>{ticket.reservation.event.name}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<!--
<Card.Root>
	<Card.Header>
		<Card.Title>Reservations</Card.Title>
		<Card.Description>A list of your previous reservations.</Card.Description>
	</Card.Header>
	<Card.Content>
	</Card.Content>
</Card.Root>
-->
