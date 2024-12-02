<script lang="ts">
	import type { ApiResponse } from "$lib/api/types";
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Select from "$lib/components/ui/select/index";
	import * as Popover from "$lib/components/ui/popover/index";
	import CalendarIcon from "lucide-svelte/icons/calendar";
	import CalendarMonthYear from "$lib/components/ui/calendar/calendar-month-year.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import { CreateEventSchema } from "$lib/map/event/schema";
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone
	} from "@internationalized/date";
	import { cn } from "$lib/utils";
	import { buttonVariants } from "$lib/components/ui/button";
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

	const df = new DateFormatter("en-US", {
		dateStyle: "long"
	});

	let startAt = $state<Date | undefined>();
	let endAt = $state<Date | undefined>();

	$effect(() => {
		startAt = $formData.start_at;
		endAt = $formData.end_at;
	});

	const timeZone = getLocalTimeZone();

	const venueTriggerContent = $derived(
		props.venues.find((v) => v.venue_id === $formData.venue_id)?.name ??
			"Select a venue."
	);
</script>

<form method="POST" {action} enctype="multipart/form-data" use:enhance>
	<Form.Field {form} name="event_id" hidden>
		<Form.Control>
			{#snippet children({ props })}
				<Input {...props} bind:value={$formData.event_id} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	<Form.Field {form} name="image">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Image</Form.Label>
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

	<Form.Field {form} name="start_at">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Start At</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: "outline" }),
							"w-[280px] justify-start pl-4 text-left font-normal",
							!startAt && "text-muted-foreground"
						)}
					>
						{startAt ? df.format(startAt) : "Pick a date"}
						<CalendarIcon class="ml-auto size-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<CalendarMonthYear
							type="single"
							value={startAt
								? new CalendarDate(
										startAt.getFullYear(),
										startAt.getMonth() + 1,
										startAt.getDate()
									)
								: undefined}
							minValue={new CalendarDate(1900, 1, 1)}
                            maxValue={new CalendarDate(2100, 1, 1)}
							calendarLabel="Event start"
							onValueChange={(v) => {
								if (!v) {
									$formData.start_at = new Date();
									return;
								}
								$formData.start_at = v.toDate(timeZone);
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.FieldErrors />
				<input hidden value={$formData.start_at} name={props.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="end_at">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>End At</Form.Label>
				<Popover.Root>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: "outline" }),
							"w-[280px] justify-start pl-4 text-left font-normal",
							!endAt && "text-muted-foreground"
						)}
					>
						{endAt ? df.format(endAt) : "Pick a date"}
						<CalendarIcon class="ml-auto size-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<CalendarMonthYear
							type="single"
							value={endAt
								? new CalendarDate(
										endAt.getFullYear(),
										endAt.getMonth() + 1,
										endAt.getDate()
									)
								: undefined}
							minValue={new CalendarDate(1900, 1, 1)}
							calendarLabel="Event start"
							onValueChange={(v) => {
								if (!v) {
									$formData.end_at = new Date();
									return;
								}
								$formData.end_at = v.toDate(timeZone);
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.FieldErrors />
				<input hidden value={$formData.end_at} name={props.name} />
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

	<Form.Button>Submit</Form.Button>
</form>
