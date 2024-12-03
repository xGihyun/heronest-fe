<script lang="ts">
	import type { ApiResponse } from "$lib/api/types";
	import * as Form from "$lib/components/ui/form/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { CreateVenueSchema } from "$lib/map/venue/schema";
	import { toast } from "svelte-sonner";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";

	type Props = {
		form: SuperValidated<Infer<typeof CreateVenueSchema>>;
	};

	let props: Props = $props();
	let toastId: number | string;

	const formState = getFormState();
	const action = formState.action === FormAction.Create ? "?/create" : "?/edit";

	const form = superForm(props.form, {
		validators: valibotClient(CreateVenueSchema),
		onSubmit: () => {
			toastId = toast.loading("Submitting...");
		},
		onResult: (event) => {
			if (event.result.type === "success") {
				const result: ApiResponse = event.result.data?.result;
				toast.success(result.message || "Success.", { id: toastId });
			}
		}
	});

	const { form: formData, enhance } = form;

	if (formState.data) {
		$formData = formState.data;
	}
</script>

<form method="POST" {action} use:enhance>
	<Form.Field {form} name="venue_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.venue_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
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

	<Form.Field {form} name="location">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Location</Form.Label>
				<Input {...props} bind:value={$formData.location} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="capacity">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Capacity</Form.Label>
				<Input {...props} bind:value={$formData.capacity} type="number" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

    <!-- TODO: Add this! -->
	<Form.Field {form} name="image_url" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Image</Form.Label>
				<Input {...props} bind:value={$formData.image_url} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
