<script lang="ts">
	import type { ApiResponse } from "$lib/api/types";
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Select from "$lib/components/ui/select/index";
	import { DateTimeInput } from "$lib/components/ui/date-time-input";
	import { Input } from "$lib/components/ui/input/index.js";
	import { CreateEventSchema } from "$lib/map/event/schema";
	import { toast } from "svelte-sonner";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import type { Venue } from "$lib/map/venue/types";
	import { FormAction } from "$lib/types";
	import { getFormState } from "./state.svelte";
	import { Checkbox } from "$lib/components/ui/checkbox";

	type Props = {
		form: SuperValidated<Infer<typeof CreateEventSchema>>;
		venues: Venue[];
	};

	let props: Props = $props();
	let toastId: number | string;

	const formState = getFormState();
	const action = formState.action === FormAction.Create ? "?/create" : "?/edit";

	const form = superForm(props.form, {
		validators: valibotClient(CreateEventSchema),
		onSubmit: () => {
			toastId = toast.loading("Submitting...");

			console.log($formData);
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

	if (formState.data !== null) {
		$formData = formState.data;
	}

	const venueTriggerContent = $derived(
		props.venues.find((v) => v.venue_id === $formData.venue_id)?.name ??
			"Select a venue."
	);
</script>

<form
	method="POST"
	{action}
	enctype="multipart/form-data"
	use:enhance
	class="space-y-4"
>
	<Form.Field {form} name="event_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.event_id} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="image" class="flex flex-col gap-1">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Thumbnail Image</Form.Label>
				<input
					type="file"
					{...props}
					oninput={(e) => {
						$formData.image = e.currentTarget.files?.item(0) || null;
					}}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="image_url" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.image_url} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Input {...props} bind:value={$formData.description} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="start_at" class="flex flex-col gap-1">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Start At</Form.Label>
				<DateTimeInput {...props} bind:value={$formData.start_at} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="end_at" class="flex flex-col gap-1">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>End At</Form.Label>
				<DateTimeInput {...props} bind:value={$formData.end_at} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="venue_id">
		<Form.Control>
			{#snippet children({ props: formProps })}
				<Form.Label>Venue</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.venue_id}
					name={formProps.name}
				>
					<Select.Trigger {...formProps}>
						{venueTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each props.venues as venue (venue.venue_id)}
							<Select.Item value={venue.venue_id} label={venue.name}
							></Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="allow_visitors" class="flex flex-row gap-2">
		<Form.Control>
			{#snippet children({ props })}
				<Checkbox {...props} bind:checked={$formData.allow_visitors} />
				<div class="space-y-1 leading-none">
					<Form.Label>Allow Visitors</Form.Label>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
