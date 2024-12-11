<script lang="ts">
	import type { Event } from "$lib/map/event/types";
	import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { DateFormatter } from "@internationalized/date";
	import { ChevronRightIcon } from "$lib/icons";
	import { UserRole, type User } from "$lib/user/types";
	import { Progress } from "$lib/components/ui/progress/index.js";

	type Props = {
		events: Event[];
		user: User;
	};

	let props: Props = $props();

	let selectedEventId = $state(props.events[0].event_id || "");

	const df = new DateFormatter("en-US", {
		dateStyle: "medium"
	});
</script>

<h1 class="mb-2 font-inter-bold text-3xl">Events</h1>

<RadioGroup.Root
	class="grid grid-cols-2 gap-4 xl:grid-cols-3"
	bind:value={selectedEventId}
>
	{#each props.events as event (event.event_id)}
		{@const isVisitor = props.user.role === UserRole.Visitor}

		<Label for={event.event_id}>
			<RadioGroup.Item
				value={event.event_id}
				id={event.event_id}
				class="peer"
				hidden
			/>
			<div class="group overflow-hidden rounded-xl border shadow">
				<AspectRatio
					ratio={16 / 12}
					class="flex w-full flex-col items-end overflow-hidden"
				>
					<div class="relative h-full w-full">
						<img
							src={event.image_url
								? `/storage/images/events/${event.image_url}`
								: null}
							alt={event.name}
							class="absolute inset-0 object-cover
                                transition-transform duration-500
                                ease-in-out group-hover:scale-110"
						/>

						{#if !isVisitor || (isVisitor && event.allow_visitors)}
							<a
								class="absolute left-0 top-0 h-full w-full content-center bg-primary/0 text-background duration-500 group-hover:bg-primary/75"
								href={`/venues/${event.venue.venue_id}/map?eventId=${event.event_id}`}
							>
								<span
									class="flex items-center justify-center font-inter-semibold text-lg opacity-0 duration-500 group-hover:opacity-100"
								>
									Reserve
									<ChevronRightIcon class="size-8" />
								</span>
							</a>
						{/if}
					</div>

					<div class="relative flex w-full flex-col gap-4 bg-card px-4 py-3">
						<div class="flex">
							<div>
								<h1 class="line-clamp-1 font-inter-semibold text-base">
									{event.name}
								</h1>
								<p class="line-clamp-1 text-sm text-muted-foreground">
									{df.formatRange(
										new Date(event.start_at),
										new Date(event.end_at)
									)}
									•
									{event.venue.name}
									{#if event.allow_visitors}
										• Visitors Allowed
									{/if}
								</p>
							</div>
						</div>

						<div class="space-y-1">
							<Progress
								value={event.total_reservation}
								max={event.venue.capacity}
								class="h-1 w-full"
							/>

							<p class="flex justify-between text-sm text-primary">
								Reservations
								<span>
									({event.total_reservation} / {event.venue.capacity})
								</span>
							</p>
						</div>
					</div>
				</AspectRatio>
			</div>
		</Label>
	{/each}
</RadioGroup.Root>
