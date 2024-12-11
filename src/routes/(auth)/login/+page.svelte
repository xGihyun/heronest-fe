<script lang="ts">
	import * as Card from "$lib/components/ui/card/index";
	import type { PageData } from "./$types";
	import LoginForm from "./form.svelte";
	import { umakBg } from "$lib/assets/images";
	import { WingIcon } from "$lib/icons";

	export let data: PageData;
</script>

<div class="grid h-full grid-cols-2">
	<section class="content-center space-y-4 p-5 overflow-auto">
		<div class="flex flex-col items-center gap-2">
			<WingIcon class="size-16 text-accent" />
			<h1 class="text-center font-inter-bold text-3xl">Welcome to Heronest</h1>
		</div>
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

	<section class="bg-primary">
		<img
			src={umakBg}
			alt="UMak"
			class="h-full w-full object-cover opacity-20"
		/>
	</section>
</div>
