<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import type { PageData } from "./$types";
	import LoginForm from "./form.svelte";

	export let data: PageData;
</script>

<div class="max-w-screen-sm mx-auto">
	<Card.Root>
		<Card.Header>
			<Card.Title>Login</Card.Title>
			<Card.Description>Enter your credentials below</Card.Description>
		</Card.Header>
		<Card.Content>
			<LoginForm form={data.form} />
		</Card.Content>
	</Card.Root>
</div>
