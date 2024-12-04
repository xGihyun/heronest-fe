<script lang="ts">
	import Konva from "konva";
	import { loadFromSvg, setupMap } from "$lib/map/utils";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { handleWheel, handleZoom } from "$lib/map/handlers";
	import {
		ArrowDownDropIcon,
		EventIcon,
		FileImportIcon,
		LocationIcon,
		MinusIcon,
		PlusIcon,
		SaveIcon
	} from "$lib/icons";
	import { Slider } from "$lib/components/ui/slider";
	import { Button } from "$lib/components/ui/button";
	import { SLIDER_SCALE } from "$lib/map/constants";
	import { handleSave } from "$lib/map/seat/handlers";
	import { toast } from "svelte-sonner";
	import { ApiResponseStatus } from "$lib/api/types";
	import { SeatStatus, type Seat } from "$lib/map/seat/types.js";
	import { v4 as uuidv4 } from "uuid";
	import { seatFillColor, setupEventListeners } from "$lib/map/seat/utils.js";
	import { selectedSeat } from "./state.svelte.js";
	import { SEAT_COLOR } from "$lib/map/seat/constants.js";
	import Sidebar from "./sidebar.svelte";
	import SeatForm from "./seat-form.svelte";
	import { UserRole } from "$lib/user/types.js";
	import ReserveForm from "./reserve-form.svelte";

	let { data } = $props();

	let mapContainer: HTMLDivElement | undefined;
	let scale = $state(SLIDER_SCALE.initial);

	let stage: Konva.Stage | undefined;
	const seatsGroup: Konva.Group = new Konva.Group();
	const layer = new Konva.Layer();

	let seats = $derived(data.seats);

	let svgInput: HTMLInputElement | undefined;

	$effect(() => {
		if (!mapContainer) {
			return;
		}

		const width = mapContainer.offsetWidth;
		const height = mapContainer.offsetHeight;

		stage = new Konva.Stage({
			container: mapContainer,
			width: width,
			height: height,
			draggable: true
		});

		stage.on("wheel", (e) => {
			if (!stage) {
				return;
			}

			scale = handleWheel(e, stage);
		});

		for (const seat of seats) {
			const rect: Konva.Rect = Konva.Node.create(seat.metadata);

			seatFillColor(seat, rect, data.user);
			//if (
			//	seat.reserved_by &&
			//	seat.reserved_by.user.user_id === data.user?.user_id
			//) {
			//	rect.fill(SEAT_COLOR.reserved_current_user);
			//} else if (seat.reserved_by) {
			//	rect.fill(SEAT_COLOR.reserved);
			//} else {
			//	rect.fill(SEAT_COLOR.available);
			//         }

			setupEventListeners(rect, seat, mapContainer, data.user);
			seatsGroup.add(rect);
		}

		setupMap(stage, layer, seatsGroup);

		return () => {
			stage?.destroyChildren();
		};
	});

	async function saveSeats(): Promise<void> {
		if (!seatsGroup) {
			return;
		}
		let toastId = toast.loading("Saving...");
		const result = await handleSave(seats, data.venueId);

		if (result.status !== ApiResponseStatus.Success) {
			toast.error(result.message || "Error.", { id: toastId });
			return;
		}

		toast.success(result.message || "Success", { id: toastId });
	}

	let selectedEventId = $state(data.eventId);

	const eventTriggerContent = $derived(
		data.events.find((e) => e.event_id === selectedEventId)?.name ??
			"Select an event"
	);
</script>

<div class="flex h-full w-full overflow-clip">
	<div class="relative h-full flex-1">
		<div
			class="absolute left-0 top-0 z-[11] flex h-20
            w-full items-center gap-2 bg-neutral-200 text-foreground shadow-map-bottom"
		>
			<LocationIcon class="size-12" />
			<div>
				<p class="font-inter-semibold">Venue</p>
				<p class="font-inter-semibold text-lg text-foreground/60">
					{data.venues.find((venue) => venue.venue_id === data.venueId)?.name}
				</p>
			</div>
		</div>

		<Select.Root type="single" bind:value={selectedEventId}>
			<Select.Trigger>
				{#snippet child({ props: triggerProps })}
					<button
						{...triggerProps}
						class="absolute left-2 top-32 z-[11] flex w-full max-w-72 items-center justify-between gap-2
                        rounded-full border-2 border-neutral-400/85 bg-neutral-900/85 px-3 py-2 text-background shadow"
					>
						<div class="flex items-center gap-2">
							<EventIcon class="size-6 text-accent" />
							<p
								class="line-clamp-1 text-start
                                font-inter-medium text-background/80"
							>
								{eventTriggerContent}
							</p>
						</div>
						<ArrowDownDropIcon class="size-6" />
					</button>
				{/snippet}
			</Select.Trigger>
			<Select.Content>
				{#each data.events as event (event.event_id)}
					<Select.Item
						value={event.event_id}
						label={event.name}
						class="hover:cursor-pointer"
					>
						{#snippet child({ props: itemProps })}
							<a
								{...itemProps}
								href={`/venues/${data.venueId}/map?eventId=${event.event_id}`}
							>
								{event.name}
							</a>
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<div
			bind:this={mapContainer}
			class="relative z-10 h-full w-full bg-neutral-200"
		></div>

		<div
			class="absolute bottom-0 left-0 z-[11] h-20 w-full bg-neutral-200
            text-foreground shadow-map-top"
		>
			<div
				class="absolute bottom-10 left-1/2
                z-10 flex w-full max-w-96 -translate-x-1/2
                cursor-pointer
                items-center gap-2 space-x-4 rounded-full border-2
                border-neutral-400/85 bg-neutral-900/85 px-3
                py-2 text-background
                shadow"
			>
				<Button
					class="h-auto rounded-full p-1"
					variant="secondary"
					onclick={() => {
						if (!stage) {
							return;
						}
						scale = handleZoom("out", stage, scale);
					}}
				>
					<MinusIcon class="size-4" />
				</Button>

				<Slider
					value={[scale]}
					min={SLIDER_SCALE.min}
					max={SLIDER_SCALE.max}
					step={SLIDER_SCALE.step}
					onValueChange={(value) => {
						if (!stage) {
							return;
						}
						scale = handleZoom("set", stage, scale, value[0]);
					}}
				/>

				<Button
					class="h-auto rounded-full p-1"
					variant="secondary"
					onclick={() => {
						if (!stage) {
							return;
						}
						scale = handleZoom("in", stage, scale);
					}}
				>
					<PlusIcon class="size-4" />
				</Button>
			</div>

			{#if data.user?.role === UserRole.Admin}
				<input
					type="file"
					accept=".svg"
					hidden
					bind:this={svgInput}
					onchange={(e) => {
						const file = e.currentTarget.files?.[0];
						if (!file) {
							return;
						}

						const reader = new FileReader();
						reader.onload = (event) => {
							if (!stage) {
								console.warn("Canvas stage not found.");
								return;
							}

							const svgContent = event.target?.result;

							if (!svgContent) {
								console.warn("SVG content not found.");
								return;
							}

							loadFromSvg(svgContent.toString(), seatsGroup);
							setupMap(stage, layer, seatsGroup);

							seatsGroup.find(".seat").forEach((node, i) => {
								if (!mapContainer) {
									return;
								}

								const rect = node as Konva.Rect;

								const seat: Seat = {
									seat_id: uuidv4(),
									status: SeatStatus.Unavailable,
									venue_id: data.venueId,
									metadata: JSON.parse(rect.toJSON()),
									seat_number: `${i + 1}`
								};

								seats.push(seat);
								setupEventListeners(rect, seat, mapContainer, data.user);
							});
						};
						reader.readAsText(file);
					}}
				/>

				<Button
					class="absolute right-44 h-auto
                w-auto rounded-full border-2 border-neutral-400/85 bg-neutral-900/85 px-3 py-2
                shadow"
					onclick={() => svgInput?.click()}
				>
					<FileImportIcon class="size-4" />
					Import
				</Button>

				<Button
					class="absolute right-20 h-auto
                w-auto rounded-full border-2 border-neutral-400/85 bg-neutral-900/85 px-3 py-2
                shadow"
					onclick={saveSeats}
				>
					<SaveIcon class="size-4" />
					Save
				</Button>
			{/if}
		</div>

		<Dialog.Root
			open={selectedSeat.seat !== null}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					selectedSeat.seat = null;
				}
			}}
		>
			<Dialog.Content>
				{#if selectedSeat.seat !== null}
					<Dialog.Header>
						<Dialog.Title>
							{#if data.user?.role !== UserRole.Admin}
								Reserve
							{/if}
							Seat
							{selectedSeat.seat.seat_number}
						</Dialog.Title>
					</Dialog.Header>

					{#if data.user?.role === UserRole.Admin}
						<SeatForm
							form={data.form}
							seat={selectedSeat.seat}
							events={data.events}
							users={data.users}
							venueId={data.venueId}
                            eventId={data.eventId}
						/>
					{:else}
						<ReserveForm
							form={data.ticketForm}
							seat={selectedSeat.seat}
							events={data.events}
							user={data.user}
						/>
					{/if}
				{/if}
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<Sidebar venues={data.venues} {seats} />
</div>
