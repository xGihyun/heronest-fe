<script lang="ts">
	import * as Form from "$lib/components/ui/form/index";
	import * as Select from "$lib/components/ui/select/index";
	import * as Popover from "$lib/components/ui/popover/index";
	import { Input } from "$lib/components/ui/input/index.js";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { UserRole, UserSex } from "$lib/user/types";
	import { FormAction, type SelectOption } from "$lib/types";
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		today,
		type DateValue
	} from "@internationalized/date";
	import { buttonVariants } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import CalendarIcon from "lucide-svelte/icons/calendar";
	import CalendarMonthYear from "$lib/components/ui/calendar/calendar-month-year.svelte";
	import { toast } from "svelte-sonner";
	import { CreateUserSchema } from "$lib/user/schema";
	import { getFormState } from "./state.svelte";
	import type { ApiResponse } from "$lib/api/types";

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
			if (event.result.type === "success") {
				const result: ApiResponse = event.result.data?.result;
				toast.success(result.message || "Success.", { id: toastId });
			}
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
			value: UserRole.Staff,
			label: "Staff"
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

	const df = new DateFormatter("en-US", {
		dateStyle: "long"
	});

	let birthDate = $state<Date | undefined>();

	$effect(() => {
		birthDate = $formData.birth_date;
	});

	const timeZone = getLocalTimeZone();

	let birthDatePlaceholder = $state<DateValue>(today(timeZone));
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
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: "outline" }),
							"w-[280px] justify-start pl-4 text-left font-normal",
							!birthDate && "text-muted-foreground"
						)}
					>
						{birthDate ? df.format(birthDate) : "Pick a date"}
						<CalendarIcon class="ml-auto size-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<CalendarMonthYear
							type="single"
							value={birthDate
								? new CalendarDate(
										birthDate.getFullYear(),
										birthDate.getMonth() + 1,
										birthDate.getDate()
									)
								: undefined}
							bind:placeholder={birthDatePlaceholder}
							minValue={new CalendarDate(1900, 1, 1)}
							maxValue={today(timeZone)}
							calendarLabel="Date of birth"
							onValueChange={(v) => {
								if (!v) {
									$formData.birth_date = new Date();
									return;
								}
								$formData.birth_date = v.toDate(timeZone);
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.FieldErrors />
				<input hidden value={$formData.birth_date} name={props.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
