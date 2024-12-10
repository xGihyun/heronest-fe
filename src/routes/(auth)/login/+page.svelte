<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import type { PageData } from "./$types";
	import LoginForm from "./form.svelte";

	export let data: PageData;
</script>

<div class="grid h-full grid-cols-2">
	<section class="content-center">
		<div class="mx-auto w-full max-w-lg">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-2xl">Login</Card.Title>
					<Card.Description>Enter your credentials below</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<LoginForm form={data.form} />

					<p class="text-center">
						Don't have an account?
						<a
							href="/register"
							class="font-inter-semibold text-primary underline"
						>
							Create one!
						</a>
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<section></section>
</div>
