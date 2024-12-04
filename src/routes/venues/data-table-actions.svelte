<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import type { Venue } from "$lib/map/venue/types";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";
	import { EditIcon } from "$lib/icons";

	type Props = {
		venue: Venue;
	};

	let props: Props = $props();

	const formState = getFormState();
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
				formState.data = props.venue;
                formState.isOpen = true
			}}
		>
            <EditIcon class="size-4" />
			Edit
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
