<script lang="ts">
	import * as Form from "$lib/components/ui/form/index";
	import { Input } from "$lib/components/ui/input/index.js";
	import { LoginSchema } from "./schema";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { toast } from "svelte-sonner";

	type Props = {
		form: SuperValidated<Infer<typeof LoginSchema>>;
	};

	let props: Props = $props();

	let toastId: number | string;

	const form = superForm(props.form, {
		validators: valibotClient(LoginSchema),
		onSubmit: () => {
			toastId = toast.loading("Submitting...");
		},
		onResult: (event) => {
			if (event.result.type === "redirect") {
				toast.success("Successfully logged in.", { id: toastId });
				return;
			}

			console.debug("Unexpected result type: " + event.result.type);
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="space-y-4" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} bind:value={$formData.password} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
