<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import { Button } from "$lib/components/ui/button";
	import { generateEventCsv } from "$lib/map/event/spreadsheet.js";
	import { generateTicketsCsv } from "$lib/ticket/spreadsheet.js";
	import Reservations from "./reservations.svelte";
	import Events from "./events.svelte";

	let { data } = $props();
</script>

<div class="space-y-4 py-10">
	<div>
		<Button onclick={() => generateEventCsv(data.events)}>
			Events Download
		</Button>
		<Button onclick={() => generateTicketsCsv(data.tickets)}>
			Reservations Download
		</Button>
	</div>

	<Events events={data.events} />

	<Separator />

	<Reservations tickets={data.tickets} />
</div>
