<script lang="ts">
	import UserProfile from "$lib/components/user-profile.svelte";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-sm">
	{#if data.user}
		<UserProfile user={data.user} />
	{:else}
		<p>Please login to see the your profile.</p>
	{/if}
</div>
