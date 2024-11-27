<script lang="ts">
	import Konva from "konva";
	import { onMount } from "svelte";
	import { loadSeats } from "$lib/map/utils";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
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
	import type { Seat } from "$lib/map/seat/types.js";

	let { data } = $props();

	const MAP_PADDING = 240;
	let mapContainer: HTMLDivElement | undefined;
	let scale = $state(SLIDER_SCALE.initial);

	let stage: Konva.Stage | undefined;
	let seatsGroup: Konva.Group | undefined;

	let selectedSeat: Seat | null = $state(null);

	onMount(async () => {
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

		const layer = new Konva.Layer();
		seatsGroup = new Konva.Group();

		//loadSeats(data.seats, seatsGroup);

		for (const seat of data.seats) {
			const node: Konva.Rect = Konva.Node.create(seat.metadata);

			node.on("click", () => {
				selectedSeat = seat;
			});
			seatsGroup.add(node);
		}

		seatsGroup.find(".seat").forEach((seat) => {
			//seat.on("click", () => {
			//	console.log(JSON.parse(seat.toJSON()));
			//});

			seat.on("mouseenter", () => {
				if (!mapContainer) {
					return;
				}
				mapContainer.style.cursor = "pointer";
			});

			seat.on("mouseleave", () => {
				if (!mapContainer) {
					return;
				}
				mapContainer.style.cursor = "default";
			});
		});

		const seatsBox = seatsGroup.getClientRect();

		const mapBackground = new Konva.Rect({
			x: 0,
			y: 0,
			width: seatsBox.width + MAP_PADDING,
			height: seatsBox.height + MAP_PADDING,
			fill: "#333333",
			stroke: "#BBBBBB",
			strokeWidth: 4
		});
		mapBackground.cache();
		mapBackground.filters([Konva.Filters.Noise]);
		mapBackground.noise(0.05);

		const mapGroup = new Konva.Group();

		mapGroup.add(mapBackground);
		mapGroup.add(seatsGroup);

		layer.add(mapGroup);
		stage.add(layer);

		const mapRect = mapGroup.getClientRect();

		const stageCenter = {
			x: stage.width() / 2,
			y: stage.height() / 2
		};

		seatsGroup.position({
			x: (seatsBox.width + MAP_PADDING - seatsBox.width) / 2,
			y: (seatsBox.height + MAP_PADDING - seatsBox.height) / 2
		});

		mapGroup.position({
			x: stageCenter.x - mapRect.width / 2 - mapRect.x,
			y: stageCenter.y - mapRect.height / 2 - mapRect.y
		});

		stage.batchDraw();

		const resizeObserver = new ResizeObserver(() => {
			if (!mapContainer || !stage) {
				return;
			}

			stage.width(mapContainer.offsetWidth);
			stage.height(mapContainer.offsetHeight);
		});
		resizeObserver.observe(mapContainer);
	});

	async function saveSeats() {
		if (!seatsGroup) {
			return;
		}
		let toastId = toast.loading("Saving...");
		const result = await handleSave(seatsGroup);

		if (result.status !== ApiResponseStatus.Success) {
			toast.error(result.message || "Error.", { id: toastId });
			return;
		}

		toast.error(result.message || "Success", { id: toastId });
	}
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
						Performing Arts Theather
					</span>
					<ArrowDownDropIcon class="size-6" />
				</button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-full max-w-96">
			{#each data.venues as venue (venue.venue_id)}
				<DropdownMenu.Item class="w-full font-inter-medium">
					{venue.name}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<div
		bind:this={mapContainer}
		class="relative z-40 h-full w-full rounded-lg bg-neutral-200"
	></div>

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

	<Dialog.Root
		open={selectedSeat !== null}
		onOpenChange={(isOpen) => {
			if (!isOpen) {
				selectedSeat = null;
			}
		}}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Seat</Dialog.Title>
			</Dialog.Header>

			{#if selectedSeat !== null}
				{selectedSeat.seat_number}
                {selectedSeat.status}

                <Button>
                    Save
                </Button>
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</div>
