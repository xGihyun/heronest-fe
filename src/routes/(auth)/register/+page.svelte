<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import type { PageData } from "./$types";
	import RegisterForm from "./form.svelte";

	export let data: PageData;
</script>

<div class="max-w-screen-sm mx-auto">
	<Card.Root>
		<Card.Header>
			<Card.Title>Register</Card.Title>
			<Card.Description>Enter your credentials below</Card.Description>
		</Card.Header>
		<Card.Content>
			<RegisterForm form={data.form} />
		</Card.Content>
	</Card.Root>
</div>
