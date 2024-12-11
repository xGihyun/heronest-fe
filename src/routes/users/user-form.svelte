<script lang="ts">
	import * as Form from "$lib/components/ui/form/index";
	import * as Select from "$lib/components/ui/select/index";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		type SuperValidated,
		type Infer,
		superForm,
		setError
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { UserRole, UserSex } from "$lib/user/types";
	import { FormAction, type SelectOption } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { CreateUserSchema } from "$lib/user/schema";
	import { getFormState } from "./state.svelte";
	import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
	import { DateTimeInput } from "$lib/components/ui/date-time-input";

	type Props = {
		form: SuperValidated<Infer<typeof CreateUserSchema>>;
	};

	let props: Props = $props();
	let toastId: number | string;

	const formState = getFormState();
	const action = formState.action === FormAction.Create ? "?/create" : "?/edit";

	const form = superForm(props.form, {
		validators: valibotClient(CreateUserSchema),
		onSubmit: () => {
			toastId = toast.loading("Submitting...");
		},
		onResult: (event) => {
			if (event.result.type !== "success") {
				console.error("Unexpected result after registration:", event.result);
				toast.error("Unexpected result after registration.", { id: toastId });
				return;
			}
		},
		onUpdate(event) {
			const isStudentEmail = event.form.data.email.endsWith("@umak.edu.ph");
			if (!isStudentEmail && event.form.data.role === UserRole.Student) {
				setError(
					event.form,
					"email",
					"Only students with UMak emails are accepted."
				);
			}

			if (event.form.data.birth_date > new Date()) {
				setError(
					event.form,
					"birth_date",
					"The maximum birth date is the current date."
				);
			}
		},
		onUpdated(event) {
			if (!event.form.valid) {
				toast.error("Invalid form data.", { id: toastId });
				return;
			}

			const result: ApiResponse = event.form.message;

			if (result.status !== ApiResponseStatus.Success) {
				toast.error(result.message, { id: toastId });
				return;
			}

			toast.success(result.message, {
				id: toastId
			});
		},
		resetForm: false
	});

	const { form: formData, enhance } = form;

	if (formState.data) {
		$formData = formState.data;
	}

	const sexOptions: SelectOption[] = [
		{
			value: UserSex.Male,
			label: "Male"
		},
		{
			value: UserSex.Female,
			label: "Female"
		}
	];

	const sexTriggerContent = $derived(
		sexOptions.find((v) => v.value === $formData.sex)?.label ?? "Select a sex."
	);

	const roleOptions: SelectOption[] = [
		{
			value: UserRole.Visitor,
			label: "Visitor"
		},
		{
			value: UserRole.Student,
			label: "Student"
		},
		{
			value: UserRole.Admin,
			label: "Admin"
		}
	];

	const roleTriggerContent = $derived(
		roleOptions.find((v) => v.value === $formData.role)?.label ??
			"Select a role."
	);
</script>

<form method="POST" {action} class="space-y-4" use:enhance>
	<Form.Field {form} name="user_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.user_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field
		{form}
		name="password"
		hidden={formState.action === FormAction.Edit}
	>
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input {...props} bind:value={$formData.password} type="password" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="role">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Role</Form.Label>
				<Select.Root
					type="single"
					bind:value={$formData.role}
					name={props.name}
				>
					<Select.Trigger {...props}>
						{roleTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each roleOptions as role (role.value)}
							<Select.Item value={role.value} label={role.label}></Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="sex">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Sex</Form.Label>
				<Select.Root type="single" bind:value={$formData.sex} name={props.name}>
					<Select.Trigger {...props}>
						{sexTriggerContent}
					</Select.Trigger>
					<Select.Content>
						{#each sexOptions as sex (sex.value)}
							<Select.Item value={sex.value} label={sex.label}></Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="first_name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>First Name</Form.Label>
				<Input {...props} bind:value={$formData.first_name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="middle_name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Middle Name</Form.Label>
				<Input {...props} bind:value={$formData.middle_name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="last_name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Last Name</Form.Label>
				<Input {...props} bind:value={$formData.last_name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="birth_date">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Date of birth</Form.Label>
				<DateTimeInput
					{...props}
					bind:value={$formData.birth_date}
					type="date"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="w-full">Submit</Form.Button>
</form>
