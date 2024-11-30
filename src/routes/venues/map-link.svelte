<script lang="ts">
	import type { Venue } from "$lib/map/venue/types";

	type Props = {
		venue: Venue;
	};

	let props: Props = $props();
</script>

<a href={`/venues/${props.venue.venue_id}/map`}>{props.venue.name}</a>
