<script lang="ts">
	import UserProfile from "$lib/components/user-profile.svelte";

	let { data } = $props();
</script>

<div class="mx-auto max-w-screen-sm">
	<UserProfile user={data.userInPage} />
</div>
