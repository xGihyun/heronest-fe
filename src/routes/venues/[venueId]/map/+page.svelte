<script lang="ts">
	import Konva from "konva";
	import { loadFromSvg, setupMap } from "$lib/map/utils";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { handleWheel, handleZoom } from "$lib/map/handlers";
	import {
		ArrowDownDropIcon,
		LocationIcon,
		MinusIcon,
		PlusIcon,
		SaveIcon
	} from "$lib/icons";
	import { Slider } from "$lib/components/ui/slider";
	import { Button } from "$lib/components/ui/button";
	import { SLIDER_SCALE } from "$lib/map/constants";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import { handleSave } from "$lib/map/seat/handlers";
	import { toast } from "svelte-sonner";
	import { ApiResponseStatus } from "$lib/api/types";
	import { SeatStatus, type Seat } from "$lib/map/seat/types.js";
	import { v4 as uuidv4 } from "uuid";
	import { setupEventListeners } from "$lib/map/seat/utils.js";
	import { selectedSeat } from "./state.svelte.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { SEAT_COLOR } from "$lib/map/seat/constants.js";
	import type { SelectOption } from "$lib/types.js";

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

			rect.fill(SEAT_COLOR[seat.status]);

			setupEventListeners(rect, seat, mapContainer);
			seatsGroup.add(rect);
		}

		setupMap(stage, layer, seatsGroup);

		const resizeObserver = new ResizeObserver(() => {
			if (!mapContainer || !stage) {
				return;
			}

			stage.width(mapContainer.offsetWidth);
			stage.height(mapContainer.offsetHeight);
		});
		resizeObserver.observe(mapContainer);

		return () => {
			stage?.destroyChildren();
			resizeObserver.disconnect();
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

	const seatStatusOptions: SelectOption[] = [
		{
			value: SeatStatus.Available,
			label: "Available"
		},
		{
			value: SeatStatus.Unavailable,
			label: "Unavailable"
		},
		{
			value: SeatStatus.Reserved,
			label: "Reserved"
		}
	];

	const seatStatusTriggerContent = $derived(
		seatStatusOptions.find((s) => s.value === selectedSeat.seat?.status)
			?.label ?? "Select a status"
	);
</script>

<div class="relative h-full w-full">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<button
					{...props}
					class="absolute left-1/2 top-10 z-50 flex -translate-x-1/2
		items-center gap-2 rounded-full border-2 border-neutral-400/85 bg-neutral-900/85 px-4 py-3
		text-background shadow"
				>
					<LocationIcon class="size-6 text-accent" />
					<span class="font-inter-medium text-background/80">
						{data.venues.find((venue) => venue.venue_id === data.venueId)?.name}
					</span>
					<ArrowDownDropIcon class="size-6" />
				</button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-full max-w-96">
			{#each data.venues as venue (venue.venue_id)}
				<DropdownMenu.Item class="w-full cursor-pointer font-inter-medium">
					{#snippet child({ props })}
						<a href={`/venues/${venue.venue_id}/map`} {...props}>
							{venue.name}
						</a>
					{/snippet}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<div
		bind:this={mapContainer}
		class="relative z-40 h-full w-full rounded-lg bg-neutral-200"
	></div>

	<div
		class="absolute left-10 top-10 z-50 w-full max-w-44 bg-neutral-900/85
        px-2 py-3 text-background"
	>
		<p class="font-inter-bold">Events</p>
		<div class="space-y-1">
			{#each data.events as event (event.event_id)}
				<p>{event.name}</p>
			{/each}
		</div>
	</div>

	<div
		class="absolute bottom-10 left-1/2
        z-50 flex w-full max-w-96 -translate-x-1/2
        cursor-pointer
		items-center gap-2 space-x-4 rounded-full border-2 border-neutral-400/85 bg-neutral-900/85 px-4
		py-3 text-background
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
			<MinusIcon class="size-6" />
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
			<PlusIcon class="size-6" />
		</Button>
	</div>

	<Button class="absolute bottom-10 right-20 z-50" onclick={saveSeats}>
		<SaveIcon class="size-6" />
		Save
	</Button>

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
					setupEventListeners(rect, seat, mapContainer);
				});
			};
			reader.readAsText(file);
		}}
	/>

	<Button
		class="absolute bottom-20 right-20 z-50"
		onclick={() => svgInput?.click()}
	>
		<SaveIcon className="size-6" />
		Import
	</Button>

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
						Seat
						{selectedSeat.seat.seat_number}
					</Dialog.Title>
				</Dialog.Header>

				<Input bind:value={selectedSeat.seat.seat_number} name="seat_number" />

				<Select.Root
					type="single"
					name="status"
					bind:value={selectedSeat.seat.status}
					onValueChange={(value) => {
						if (selectedSeat.rect === null) {
							return;
						}
						selectedSeat.rect.fill(SEAT_COLOR[value as SeatStatus]);
					}}
				>
					<Select.Trigger>
						{seatStatusTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.GroupHeading>Status</Select.GroupHeading>
							{#each seatStatusOptions as status (status.value)}
								<Select.Item value={status.value} label={status.label}
								></Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</div>
