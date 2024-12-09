<script lang="ts">
	import { page } from "$app/stores";
	import { GeminiIcon } from "$lib/icons";
	import type { Venue } from "$lib/map/venue/types";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { type Seat } from "$lib/map/seat/types";
	import { selectedSeat } from "./state.svelte";

	type Props = {
		venues: Venue[];
		seats: Seat[];
	};

	let props: Props = $props();
</script>

<aside class="relative z-[11] h-full w-64 bg-neutral-200 shadow-map">
	<div class="h-20 content-center">
		<h1 class="px-3 py-2 text-center font-inter-bold text-2xl">Venue Map</h1>
	</div>

	<Tabs.Root value="venues">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="venues">Venues</Tabs.Trigger>
			<Tabs.Trigger value="seats">Seats</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="venues">
			<div class="flex flex-col h-[40rem] divide-y divide-foreground/20">
				{#each props.venues as venue (venue.venue_id)}
					{@const isActive = $page.url.pathname.includes(venue.venue_id)}
					<a
						href={`/venues/${venue.venue_id}/map`}
						class={`flex items-center gap-2 px-3 py-2 ${
							isActive
								? "bg-primary text-sidebar"
								: "bg-sidebar text-sidebar-primary"
						}`}
					>
						<GeminiIcon class="size-3" />
						{venue.name}
					</a>
				{/each}
			</div>
		</Tabs.Content>

		<Tabs.Content value="seats">
			{#if props.seats.length === 0}
				<p class="text-muted-foreground text-center">No seats available.</p>
			{:else}
				<div
					class="flex h-[40rem] flex-col divide-y
                divide-foreground/20 overflow-y-scroll"
				>
					{#each props.seats as seat (seat.seat_id)}
						<button
							class={`flex items-center gap-2 px-3 py-2 duration-300 hover:bg-background`}
							onclick={() => (selectedSeat.seat = seat)}
						>
							<GeminiIcon class="size-3" />
							<div class="flex flex-col items-start">
								Seat {seat.seat_number}

								<p class="text-xs text-muted-foreground first-letter:uppercase">

									{#if seat.reservation}
										Reserved by
										<span class="font-inter-semibold">
											{seat.reservation.user.first_name}
											{seat.reservation.user.last_name}
										</span>
                                    {:else}
                                        Available
									{/if}
								</p>
							</div>
						</button>
					{/each}
				</div>
			{/if}

            <div>
            </div>
		</Tabs.Content>
	</Tabs.Root>
</aside>
