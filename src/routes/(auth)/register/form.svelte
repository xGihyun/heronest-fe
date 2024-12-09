<script lang="ts">
	import * as Form from "$lib/components/ui/form/index";
	import * as Select from "$lib/components/ui/select/index";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { UserRole, UserSex } from "$lib/user/types";
	import type { SelectOption } from "$lib/types";
	import { toast } from "svelte-sonner";
	import { RegisterSchema } from "$lib/user/schema";
	import { DateTimeInput } from "$lib/components/ui/date-time-input";
	import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";

	type Props = {
		form: SuperValidated<Infer<typeof RegisterSchema>>;
	};

	let props: Props = $props();

	let toastId: number | string;

	const form = superForm(props.form, {
		validators: valibotClient(RegisterSchema),
		onSubmit: () => {
			toastId = toast.loading("Submitting...");
		},
		onResult: (event) => {
			if (event.result.type !== "success") {
				console.error("Unexpected result after registration:", event.result);
				toast.error("Unexpected result after registration.", { id: toastId });
				return;
			}

			const result: ApiResponse = event.result.data?.result;

			if (result.status !== ApiResponseStatus.Success) {
				toast.error(result.message, { id: toastId });
				return;
			}

			toast.success(result.message, {
				id: toastId
			});
		}
	});

	const { form: formData, enhance } = form;

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
		}
	];

	const roleTriggerContent = $derived(
		roleOptions.find((v) => v.value === $formData.role)?.label ??
			"Select a role."
	);
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

	<Form.Button>Submit</Form.Button>
</form>
