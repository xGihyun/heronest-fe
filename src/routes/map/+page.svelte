<script lang="ts">
	import seatsSvg from "./seats.svg";
	import Konva from "konva";
	import { onMount } from "svelte";
	import { loadFromSvg } from "$lib/map/utils";
	import { handleWheel } from "$lib/map/handlers";
  import * as Dialog from "$lib/components/ui/dialog/index.js";

	import { ArrowDownDropIcon, LocationIcon } from "$lib/icons";

	const MAP_PADDING = 240;
	let mapContainer: HTMLDivElement | undefined;

	onMount(async () => {
		if (!mapContainer) {
			return;
		}

		const width = mapContainer.offsetWidth;
		const height = mapContainer.offsetHeight;

		const stage = new Konva.Stage({
			container: mapContainer,
			width: width,
			height: height,
			draggable: true
		});

		stage.on("wheel", (e) => {
			handleWheel(e, stage);
		});

		const layer = new Konva.Layer();
		const seatsGroup = new Konva.Group();

		await loadFromSvg(seatsSvg, seatsGroup);

		seatsGroup.find(".seat").forEach((seat) => {
			seat.on("click", () => {
				console.log(JSON.parse(seat.toJSON()));
			});

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
			if (!mapContainer) {
				return;
			}

			stage.width(mapContainer.offsetWidth);
			stage.height(mapContainer.offsetHeight);
		});
		resizeObserver.observe(mapContainer);
	});
</script>

<div class="relative h-[100svh] w-full">
	<button
		class="absolute left-1/2 top-10 z-50 flex -translate-x-1/2
		items-center gap-2 rounded-full border-2 border-neutral-400/85 bg-neutral-900/85 px-4 py-3
		shadow text-background"
	>
		<LocationIcon class="size-6 text-accent" />
		<span class="font-inter-medium text-background/80"> Performing Arts Theather </span>
		<ArrowDownDropIcon class="size-6" />
	</button>

	<div
		bind:this={mapContainer}
		class="relative z-40 h-full w-full rounded-lg bg-neutral-200"
	></div>
</div>
