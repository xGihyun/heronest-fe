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
	import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
	import { getAuthContext } from "$lib/user/auth/context.svelte";
	import type { User } from "$lib/user/types";
	import { goto } from "$app/navigation";

	type Props = {
		form: SuperValidated<Infer<typeof LoginSchema>>;
	};

	let props: Props = $props();
	let toastId: number | string;
	const authContext = getAuthContext();

	const form = superForm(props.form, {
		validators: valibotClient(LoginSchema),
		onSubmit() {
			toastId = toast.loading("Logging in...");
		},
		onResult(event) {
			if (event.result.type !== "success") {
				console.error("Unexpected result after login: ", event.result);
				toast.error("Unexpected result after login.", { id: toastId });
				return;
			}
		},
		async onUpdated(event) {
			if (!event.form.valid) {
				toast.error("Invalid form data.", { id: toastId });
				return;
			}

			const result: ApiResponse<User> = event.form.message;

			if (result.status !== ApiResponseStatus.Success) {
				toast.error(result.message, { id: toastId });
				return;
			}

			authContext.user = result.data;
			toast.success(result.message, { id: toastId });

			await goto("/");
		},
		resetForm: false
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

	<Form.Button class="w-full">Login</Form.Button>
</form>
