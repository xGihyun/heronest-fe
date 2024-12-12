<script lang="ts">
	import { CreateTicketSchema } from "$lib/ticket/schema";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Select from "$lib/components/ui/select/index";
	import { Input } from "$lib/components/ui/input/index.js";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";
	import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
	import type { Event } from "$lib/map/event/types";
	import type { Seat } from "$lib/map/seat/types";
	import { UserRole, type User } from "$lib/user/types";
	import { getAuthContext } from "$lib/user/auth/context.svelte";

	type Props = {
		form: SuperValidated<Infer<typeof CreateTicketSchema>>;
		events: Event[];
		seat: Seat;
		user: User;
	};

	let props: Props = $props();

	let toastId: number | string;

	const form = superForm(props.form, {
		validators: valibotClient(CreateTicketSchema),
		onSubmit: () => {
			toastId = toast.loading("Creating...");
		},
		onResult: (event) => {
			if (event.result.type === "success") {
				const result: ApiResponse = event.result.data?.result;

				if (result.status !== ApiResponseStatus.Success) {
					toast.error(result.message, { id: toastId });
					return;
				}
				toast.success(result.message, { id: toastId });
			}
		},
		resetForm: false
	});

	const { form: formData, enhance } = form;

	$formData = {
		...$formData,
		seat_id: props.seat.seat_id,
		user_id: props.user.user_id
	};

	const eventTriggerContent = $derived(
		props.events.find((e) => e.event_id === $formData.event_id)?.name ??
			"Select an event"
	);

	const selectedEvent = $derived(
		props.events.find((e) => e.event_id === $formData.event_id)
	);

	const authContext = getAuthContext();
</script>

<form method="POST" action="?/reserveSeat" class="space-y-4" use:enhance>
	<Form.Field {form} name="user_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.user_id} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="seat_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Event</Form.Label>
				<Input {...props} bind:value={$formData.seat_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="event_id">
		<Form.Control>
			{#snippet children({ props: controlProps })}
				<Form.Label>Event</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.event_id}
					name={controlProps.name}
				>
					<Select.Trigger {...controlProps}>
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

	<Form.Button
		disabled={authContext.user?.role === UserRole.Visitor &&
			!selectedEvent?.allow_visitors}
	>
		Reserve
	</Form.Button>
</form>
