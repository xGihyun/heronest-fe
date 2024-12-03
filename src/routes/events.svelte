<script lang="ts">
	import type { Event } from "$lib/map/event/types";
	import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { DateFormatter } from "@internationalized/date";

	type Props = {
		events: Event[];
	};

	let props: Props = $props();

	let selectedEventId = $state(props.events[0].event_id || "");

	const df = new DateFormatter("en-US", {
		dateStyle: "medium"
	});
</script>

<h1 class="mb-1 font-inter-bold text-2xl">Events</h1>

<RadioGroup.Root
	class="grid grid-cols-2 gap-4 lg:grid-cols-3"
	bind:value={selectedEventId}
>
	{#each props.events as event (event.event_id)}
		<Label for={event.event_id}>
			<RadioGroup.Item
				value={event.event_id}
				id={event.event_id}
				class="peer"
				hidden
			/>
			<div class="group overflow-hidden rounded-xl border shadow">
				<AspectRatio
					ratio={16 / 10}
					class="flex w-full items-end overflow-hidden"
				>
					<img
						src={event.image_url
							? `/storage/images/events/${event.image_url}`
							: null}
						alt={event.name}
						class="absolute inset-0 object-cover
                                transition-transform duration-500
                                ease-in-out group-hover:scale-110"
					/>
					<div class="relative w-full space-y-1 bg-background px-4 py-3">
						<h1 class="font-inter-semibold text-lg">
							{event.name}
						</h1>
						<p class="text-muted-foreground">
							{df.formatRange(new Date(event.start_at), new Date(event.end_at))}
							•
							{event.venue.name}
						</p>
					</div>
				</AspectRatio>
			</div>
		</Label>
	{/each}
</RadioGroup.Root>
