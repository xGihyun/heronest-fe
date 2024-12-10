<script lang="ts">
	import { LocationIcon } from "$lib/icons";
	import type { Event } from "$lib/map/event/types";

	type Props = {
		event: Event;
	};

	let props: Props = $props();
</script>

<a
	href={`/venues/${props.event.venue.venue_id}/map?eventId=${props.event.event_id}`}
	class="flex items-center gap-2 font-inter-semibold text-primary underline"
>
	<LocationIcon class="size-4" />
	{props.event.name}
</a>
