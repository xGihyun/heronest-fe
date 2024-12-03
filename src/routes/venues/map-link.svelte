<script lang="ts">
	import { LocationIcon } from "$lib/icons";
	import type { Venue } from "$lib/map/venue/types";

	type Props = {
		venue: Venue;
	};

	let props: Props = $props();
</script>

<a
	href={`/venues/${props.venue.venue_id}/map`}
	class="flex items-center gap-2 font-inter-semibold text-blue-800 underline"
>
	<LocationIcon class="size-4" />
	{props.venue.name}
</a>
