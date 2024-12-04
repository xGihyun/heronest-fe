<script lang="ts">
	import { Separator } from "$lib/components/ui/separator";
	import Reservations from "./reservations.svelte";
	import Events from "./events.svelte";

	let { data } = $props();
</script>

<div class="space-y-4 py-10 ">
	<Events events={data.events} />

	<Separator />

	<Reservations tickets={data.tickets} />
</div>
