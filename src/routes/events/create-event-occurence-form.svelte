<script lang="ts">
	import type { ApiResponse } from "$lib/api/types";
	import * as Form from "$lib/components/ui/form/index.js";
	import * as Popover from "$lib/components/ui/popover/index";
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
	import { Input } from "$lib/components/ui/input/index.js";
	import { CreateEventOccurrenceSchema } from "$lib/map/event/schema";
	import { toast } from "svelte-sonner";
	import {
		type SuperValidated,
		type Infer,
		superForm
	} from "sveltekit-superforms";
	import { valibotClient } from "sveltekit-superforms/adapters";

	type Props = {
		form: SuperValidated<Infer<typeof CreateEventOccurrenceSchema>>;
	};

	let props: Props = $props();
	let toastId: number | string;

	const form = superForm(props.form, {
		validators: valibotClient(CreateEventOccurrenceSchema),
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

	const df = new DateFormatter("en-US", {
		dateStyle: "long"
	});
	const timeZone = getLocalTimeZone();
	let startAt = $state<Date | null>(null);
	let endAt = $state<Date | null>(null);

	$effect(() => {
		startAt = $formData.start_at;
		endAt = $formData.end_at;
	});
</script>

<form method="POST" action="?/createOccurrence" use:enhance>
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
							maxValue={today(timeZone)}
							calendarLabel="Event Start Date"
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
							maxValue={today(timeZone)}
							calendarLabel="Event Start Date"
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

	<Form.Field {form} name="event_id">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Input {...props} bind:value={$formData.event_id} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
