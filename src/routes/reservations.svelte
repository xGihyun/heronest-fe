<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { FileDownloadIcon } from "$lib/icons";
	import { TicketStatus, type Ticket } from "$lib/ticket/types";
	import { UserRole, type User, type UserBriefDetail } from "$lib/user/types";
	import { formatUserName, getUserInitials } from "$lib/user/utils";
	import { DateFormatter } from "@internationalized/date";

	type Props = {
		tickets: Ticket[];
		user: User;
	};

	let props: Props = $props();

	const df = new DateFormatter("en-US", {
		dateStyle: "medium"
	});
</script>

<h1 class="mb-2 font-inter-bold text-3xl">Reservations</h1>

<div class="rounded-md border bg-card">
	{#if props.tickets.length === 0}
		<p class="p-4">No reservations yet.</p>
	{:else}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#if props.user.role === UserRole.Admin}
						<Table.Head>User</Table.Head>
					{/if}
					<Table.Head>Ticket No.</Table.Head>
					<Table.Head>Reserved At</Table.Head>
					<Table.Head>Venue</Table.Head>
					<Table.Head>Event</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each props.tickets as ticket (ticket.ticket_id)}
					<Table.Row>
						{#if props.user.role === UserRole.Admin}
							<Table.Cell>
								{@render userLink(ticket.reservation.user)}
							</Table.Cell>
						{/if}

						<Table.Cell>
							<a
								href={`/storage/tickets/Ticket-${ticket.ticket_number}.pdf`}
								target="_blank"
								rel="noreferrer"
								class="flex items-center gap-2 font-inter-semibold text-primary underline"
							>
								<FileDownloadIcon class="size-4" />
								{ticket.ticket_number}
							</a>
						</Table.Cell>
						<Table.Cell>
							{df.format(new Date(ticket.reserved_at))}
						</Table.Cell>
						<Table.Cell>{ticket.reservation.venue.name}</Table.Cell>
						<Table.Cell>{ticket.reservation.event.name}</Table.Cell>
						<Table.Cell>
							<Badge
								variant={ticket.status === TicketStatus.Reserved
									? "default"
									: "outline"}
							>
								<span class="first-letter:capitalize">
									{ticket.status}
								</span>
							</Badge>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>

{#snippet userLink(user: UserBriefDetail)}
	<a
		href={`/users/${user.user_id}`}
		class="flex items-center gap-2 font-inter-semibold"
	>
		<Avatar.Root>
			<Avatar.Image src={user.avatar_url} alt={user.last_name} />
			<Avatar.Fallback class="bg-background">
				{getUserInitials(user)}
			</Avatar.Fallback>
		</Avatar.Root>

		<p class="text-primary underline">
			{formatUserName(user, "lf")}
		</p>
	</a>
{/snippet}

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
