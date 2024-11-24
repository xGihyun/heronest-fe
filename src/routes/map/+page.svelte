<script lang="ts">
	import seatsSvg from "./seats.svg";
	import Konva from "konva";
	import { onMount } from "svelte";
	import { loadFromSvg } from "$lib/map/utils";
	import { handleWheel } from "$lib/map/handlers";

	import MapPinIcon from "lucide-svelte/icons/map-pin";

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
			width: seatsBox.width + 50,
			height: seatsBox.height + 50,
			fill: "#333333",
			stroke: "#BBBBBB",
			strokeWidth: 4
		});
		mapBackground.cache();
		mapBackground.filters([Konva.Filters.Noise]);
		mapBackground.noise(0.05);

		const mapGroup = new Konva.Group();

		//mapGroup.add(mapBackground)
		mapGroup.add(seatsGroup);

		layer.add(mapGroup);
		stage.add(layer);

		const mapRect = mapGroup.getClientRect();

		const stageCenter = {
			x: stage.width() / 2,
			y: stage.height() / 2
		};

		seatsGroup.position({
			x: stageCenter.x - seatsBox.width / 2 - seatsBox.x,
			y: stageCenter.y - seatsBox.height / 2 - seatsBox.y
		});

		//mapGroup.position({
		//	x: stageCenter.x - mapRect.width / 2 - mapRect.x,
		//	y: stageCenter.y - mapRect.height / 2 - mapRect.y
		//});

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
	<div
		class="absolute left-1/2 top-10 z-50 flex -translate-x-1/2
		items-center gap-2 rounded-md border bg-background px-4 py-3 shadow"
	>
		<MapPinIcon />
		<span class="font-inter-medium"> Performing Arts Theather </span>
	</div>

	<div
		bind:this={mapContainer}
		class="relative z-40 h-full w-full bg-neutral-200 rounded-lg"
	></div>
</div>
