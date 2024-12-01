<script lang="ts">
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Select from "$lib/components/ui/select/index";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		CreateSeatSchema,
		type CreateSeatOutput
	} from "$lib/map/seat/schema";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import type { SelectOption } from "$lib/types";
	import { SeatStatus } from "$lib/map/seat/types";
	import type { Event } from "$lib/map/event/types";
	import { toast } from "svelte-sonner";
	import type { ApiResponse } from "$lib/api/types";

	type Props = {
		form: SuperValidated<Infer<typeof CreateSeatSchema>>;
		seat: CreateSeatOutput;
		events: Event[];
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
				toast.success(result.message || "Success.", { id: toastId });
			}
		},
		resetForm: false
	});

	const { form: formData, enhance } = form;

	$formData = props.seat;

	const seatStatusOptions: SelectOption[] = [
		{
			value: SeatStatus.Available,
			label: "Available"
		},
		{
			value: SeatStatus.Unavailable,
			label: "Unavailable"
		},
		{
			value: SeatStatus.Reserved,
			label: "Reserved"
		}
	];

	const seatStatusTriggerContent = $derived(
		seatStatusOptions.find((s) => s.value === $formData.status)?.label ??
			"Select a status"
	);
</script>

<form method="POST" action="?/createSeat" use:enhance>
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

	<Form.Field {form} name="seat_section_id">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Seat Section</Form.Label>
				<Input {...props} bind:value={$formData.seat_section_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="status">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Status</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.status}
					name={props.name}
				>
					<Select.Trigger {...props}>
						{seatStatusTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each seatStatusOptions as status (status.value)}
							<Select.Item value={status.value} label={status.label}
							></Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	{#if props.seat.reserved_by !== null}
		<h2 class="font-inter-bold">Reserved By</h2>

		<Form.Field {form} name="reserved_by.metadata">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Reserved by Metadata</Form.Label>
					<Input {...props} bind:value={$formData.reserved_by.metadata} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="reserved_by.user_id" hidden>
			<Form.Control>
				{#snippet children({ props })}
					<Input {...props} bind:value={$formData.reserved_by.user_id} />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="reserved_by.seat_id" hidden>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Seat Id</Form.Label>
					<Input {...props} bind:value={$formData.reserved_by.seat_id} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="reserved_by.event_id">
			<Form.Control>
				{#snippet children({ props: childProps })}
					<Form.Label>Event</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.reserved_by.event_id}
						name={childProps.name}
					>
						<Select.Trigger {...childProps}>
							{seatStatusTriggerContent}
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
	{/if}

	<Form.Button>Submit</Form.Button>
</form>
