<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { handleZoom } from "$lib/map/handlers";
	import { MinusIcon, PlusIcon } from "$lib/icons";
	import { SLIDER_SCALE } from "$lib/map/constants";
	import { Slider } from "$lib/components/ui/slider";
	import { mapState } from "./state.svelte";
	import type { Stage } from "konva/lib/Stage";

	type Props = {
		stage: Stage;
	};

	let props: Props = $props();
</script>

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
			if (!props.stage) {
				return;
			}
			mapState.scale = handleZoom("out", props.stage, mapState.scale);
		}}
	>
		<MinusIcon class="size-6" />
	</Button>

	<Slider
		value={[mapState.scale]}
		min={SLIDER_SCALE.min}
		max={SLIDER_SCALE.max}
		step={SLIDER_SCALE.step}
		onValueChange={(value) => {
			if (!props.stage) {
				return;
			}
			mapState.scale = handleZoom("set", props.stage, mapState.scale, value[0]);
		}}
	/>

	<Button
		class="h-auto rounded-full p-1"
		variant="secondary"
		onclick={() => {
			if (!props.stage) {
				return;
			}
			mapState.scale = handleZoom("in", props.stage, mapState.scale);
		}}
	>
		<PlusIcon class="size-6" />
	</Button>
</div>
