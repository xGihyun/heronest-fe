<script lang="ts">
	import { page } from "$app/stores";
	import { Input } from "$lib/components/ui/input";
	import { goto, invalidateAll } from "$app/navigation";
	import UserForm from "./user-form.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { FileDownloadIcon, PlusIcon, SearchIcon } from "$lib/icons";
	import { FormAction } from "$lib/types";
	import { getFormState } from "./state.svelte";
	import type { Infer, SuperValidated } from "sveltekit-superforms";
	import type { CreateUserSchema } from "$lib/user/schema";
	import type { User } from "$lib/user/types";
	import { getUsers } from "$lib/user/requests";
	import { generateUsersCsv } from "$lib/user/spreadsheet";

	type Props = {
		form: SuperValidated<Infer<typeof CreateUserSchema>>;
	};
	let props: Props = $props();

	const formState = getFormState();
	let searchValue = $state("");

	async function searchUser() {
		console.log(searchValue);
		const params = $page.url.searchParams;

		params.set("name", searchValue);

		await goto(`?${params.toString()}`);
		await invalidateAll();
	}

	async function downloadUsers() {
		const users = await getUsers();

		await generateUsersCsv(users.data);
	}
</script>

<Dialog.Root
	bind:open={formState.isOpen}
	onOpenChange={(open) => {
		if (!open) {
			formState.reset();
		}
	}}
>
	<div class="mb-2 flex justify-between gap-2">
		<div class="relative w-full max-w-sm">
			<Input
				class="peer w-full ps-9"
				type="search"
				placeholder="Enter a user's name or email..."
				bind:value={searchValue}
				onkeypress={(e) => {
					if (e.key === "Enter") {
						searchUser();
					}
				}}
			/>

			<div
				class="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50"
			>
				<SearchIcon class="size-4" />
			</div>
		</div>

		<div>
			<Button onclick={downloadUsers} variant="outline">
				<FileDownloadIcon class="size-4" />
				Report
			</Button>

			<Dialog.Trigger class={buttonVariants({ variant: "default" })}>
				<PlusIcon class="size-4" />
				Create
			</Dialog.Trigger>
		</div>
	</div>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{#if formState.action === FormAction.Create}
					Create
				{:else}
					Edit
				{/if}
				User
			</Dialog.Title>
			<Dialog.Description>Enter the user's details below.</Dialog.Description>
		</Dialog.Header>

		<UserForm form={props.form} />
	</Dialog.Content>
</Dialog.Root>
