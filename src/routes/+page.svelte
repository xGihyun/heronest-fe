<script lang="ts">
	import Reservations from "./reservations.svelte";
	import Events from "./events.svelte";

	let { data } = $props();
</script>

<div class="flex w-full">
	{#if data.user}
		<div class="w-full">
			<div class="p-5">
				<Events events={data.events} user={data.user} />
			</div>

			<div class="p-5">
				<Reservations tickets={data.tickets} user={data.user} />
			</div>
		</div>
	{:else}
		<p>Log in to see the events!</p>
	{/if}
</div>
