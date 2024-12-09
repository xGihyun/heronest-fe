<script lang="ts">
	import type { Stage } from "konva/lib/Stage";
	import { loadFromSvg, setupMap } from "$lib/map/utils";
	import type { Layer } from "konva/lib/Layer";
	import { Button } from "$lib/components/ui/button";
	import { SaveIcon } from "$lib/icons";
	import { toast } from "svelte-sonner";
	import { handleSave } from "$lib/map/seat/handlers";
	import { mapState } from "./state.svelte";
	import { ApiResponseStatus } from "$lib/api/types";
	import type { Group } from "konva/lib/Group";
	import { Rect } from "konva/lib/shapes/Rect";
	import { type Seat } from "$lib/map/seat/types";
	import { v4 as uuidv4 } from "uuid";
	import { setupEventListeners } from "$lib/map/seat/utils";
	import type { User } from "$lib/user/types";

    // NOTE: This is not used
	type Props = {
		mapContainer: HTMLDivElement;
		stage: Stage;
		layer: Layer;
		group: Group;
		venueId: string;
        user: User
	};

	let props: Props = $props();

	let svgInput: HTMLInputElement | undefined;

	async function saveSeats(): Promise<void> {
		let toastId = toast.loading("Saving...");
		const result = await handleSave(mapState.seats, props.venueId);

		if (result.status !== ApiResponseStatus.Success) {
			toast.error(result.message || "Error.", { id: toastId });
			return;
		}

		toast.success(result.message || "Success", { id: toastId });
	}
</script>

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
			const svgContent = event.target?.result;

			if (!svgContent) {
				console.warn("SVG content not found.");
				return;
			}

			loadFromSvg(svgContent.toString(), props.group);
			setupMap(props.stage, props.layer, props.group);

			props.group.find(".seat").forEach((node, i) => {
				const rect = node as Rect;

				const seat: Seat = {
					seat_id: uuidv4(),
					venue_id: props.venueId,
					metadata: JSON.parse(rect.toJSON()),
					seat_number: `${i + 1}`
				};

				mapState.seats.push(seat);
				setupEventListeners(rect, seat, props.mapContainer, props.user);
			});
		};
		reader.readAsText(file);
	}}
/>

<Button
	class="absolute bottom-20 right-80 z-50"
	onclick={() => svgInput?.click()}
>
	<SaveIcon className="size-6" />
	Import
</Button>

<Button class="absolute bottom-10 right-80 z-50" onclick={saveSeats}>
	<SaveIcon class="size-6" />
	Save
</Button>
