<script lang="ts">
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Select from "$lib/components/ui/select/index";
	import { Input } from "$lib/components/ui/input/index.js";
	import { CreateSeatSchema } from "$lib/map/seat/schema";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { type Seat, type SeatReservation } from "$lib/map/seat/types";
	import type { Event } from "$lib/map/event/types";
	import { toast } from "svelte-sonner";
	import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
	import type { User } from "$lib/user/types";
	import { formatUserName } from "$lib/user/utils";
	import * as Command from "$lib/components/ui/command/index.js";
	import { Button } from "$lib/components/ui/button";

	type Props = {
		form: SuperValidated<Infer<typeof CreateSeatSchema>>;
		seat: Seat;
		//seat: CreateSeatOutput;
		events: Event[];
		users: User[];
		venueId: string;
		eventId: string;
	};

	let props: Props = $props();
	let toastId: number | string;

	const form = superForm(props.form, {
		validators: valibotClient(CreateSeatSchema),
		dataType: "json",
		onSubmit: () => {
			toastId = toast.loading("Creating...");
		},
		onResult: (event) => {
			if (event.result.type === "success") {
				const result: ApiResponse = event.result.data?.result;

				// TODO: Fix this pls
				if (result.status !== ApiResponseStatus.Success) {
					toast.error("User has an existing reservation.", { id: toastId });
				} else {
					toast.success(result.message || "Success.", { id: toastId });
				}
			} else if (event.result.type === "failure") {
				toast.error("Please select a user and an event when reserving.", {
					id: toastId
				});
			}
			console.log(event.result);
		},
		resetForm: false
	});

	const { form: formData, enhance } = form;

	$formData = {
		seat_id: props.seat.seat_id,
		seat_number: props.seat.seat_number,
		venue_id: props.venueId,
		metadata: props.seat.metadata,
		seat_section_id: props.seat.seat_section_id || null,
		reservation: {
			user_id: props.seat.reservation?.user.user_id || "",
			event_id: props.seat.reservation?.event.event_id || props.eventId
		}
	};

	const eventTriggerContent = $derived(
		props.events.find((e) => e.event_id === $formData.reservation.event_id)
			?.name ?? "Select an event"
	);
	const userTriggerContent = $derived(getUserTriggerContent());

	function getUserTriggerContent(): string {
		const user = props.users.find(
			(u) => u.user_id === $formData.reservation.user_id
		);

		if (!user) {
			return "Select a user";
		}

		return formatUserName(user);
	}

	async function generateTicketFile(
		ticket: SeatReservation
	): Promise<void> {
		let toastId = toast.loading("Generating ticket...");

		const response = await fetch(`/api/tickets`, {
			method: "POST",
			body: JSON.stringify(ticket),
			headers: {
				"Content-Type": "application/json"
			}
		});

		if (!response.ok) {
			console.error("Failed to generate ticket.");
			toast.error("Failed to generate ticket.", { id: toastId });
			return;
		}

		toast.success(
			"Successfully generated ticket file for: " + ticket.ticket_number,
			{ id: toastId }
		);
	}
</script>

<form method="POST" action="?/createSeat" use:enhance class="space-y-4">
	<Form.Field {form} name="seat_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.seat_id} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="venue_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.venue_id} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="metadata" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.metadata} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="seat_number">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Seat Number</Form.Label>
				<Input {...props} bind:value={$formData.seat_number} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<!-- TODO: Implement seat section? -->
	<Form.Field {form} name="seat_section_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Seat Section</Form.Label>
				<Input {...props} bind:value={$formData.seat_section_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<h2 class="font-inter-semibold">Reserved By</h2>

	<Form.Field {form} name="reservation.user_id">
		<Form.Control>
			{#snippet children({ props: childProps })}
				<Form.Label>User</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.reservation.user_id}
					name={childProps.name}
				>
					<Select.Trigger {...childProps}>
						{userTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Command.Root>
							<Command.Input placeholder="Search user..." />
							<Command.List>
								<Command.Empty>No users found.</Command.Empty>

								{#each props.users as user (user.user_id)}
									<Command.Item>
										{#snippet child({ props: commandProps })}
											<Select.Item
												{...commandProps}
												value={user.user_id}
												label={formatUserName(user)}
											></Select.Item>
										{/snippet}
									</Command.Item>
								{/each}
							</Command.List>
						</Command.Root>
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="reservation.event_id">
		<Form.Control>
			{#snippet children({ props: childProps })}
				<Form.Label>Event</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.reservation.event_id}
					name={childProps.name}
				>
					<Select.Trigger {...childProps}>
						{eventTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each props.events as event (event.event_id)}
							<Select.Item value={event.event_id} label={event.name}
							></Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if props.seat.reservation}
		<Button
			onclick={() => {
				if (!props.seat.reservation) {
					return;
				}
				generateTicketFile(props.seat.reservation);
			}}
		>
			Generate Ticket
		</Button>
	{/if}

	<Form.Button>Submit</Form.Button>
</form>
