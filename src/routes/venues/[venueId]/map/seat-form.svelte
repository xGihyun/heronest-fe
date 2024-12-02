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
	import type { User } from "$lib/user/types";
	import { formatUserName } from "$lib/user/utils";
	import * as Command from "$lib/components/ui/command/index.js";

	type Props = {
		form: SuperValidated<Infer<typeof CreateSeatSchema>>;
		seat: CreateSeatOutput;
		events: Event[];
		users: User[];
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
	const eventTriggerContent = $derived(
		props.events.find((e) => e.event_id === $formData.reserved_by.event_id)
			?.name ?? "Select an event"
	);
	const userTriggerContent = $derived(getUserTriggerContent());

	function getUserTriggerContent(): string {
		const user = props.users.find(
			(u) => u.user_id === $formData.reserved_by.user_id
		);

		if (!user) {
			return "Select a user";
		}

		return formatUserName(user);
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

	{#if $formData.status === SeatStatus.Reserved}
		<h2 class="font-inter-semibold">Reserved By</h2>

		<Form.Field {form} name="reserved_by.metadata" hidden>
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Metadata</Form.Label>
					<Input {...props} bind:value={$formData.reserved_by.metadata} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="reserved_by.user_id">
			<Form.Control>
				{#snippet children({ props: childProps })}
					<Form.Label>User</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.reserved_by.user_id}
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
	{/if}

	<Form.Button>Submit</Form.Button>
</form>
