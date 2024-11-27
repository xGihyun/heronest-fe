<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";
	import type { User } from "$lib/user/types";

	type Props = {
		user: User;
	};

	let props: Props = $props();

	const formState = getFormState();

	// TODO: Remove `password`
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
			>
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item
			onclick={() => {
				formState.action = FormAction.Edit;
				formState.data = {
					...props.user,
					birth_date: new Date(props.user.birth_date),
					password: "password"
				};
				formState.isOpen = true;
			}}
		>
			Edit
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
