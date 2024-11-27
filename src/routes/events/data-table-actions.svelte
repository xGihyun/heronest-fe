<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import { buttonVariants } from "$lib/components/ui/button";
	import EventForm from "./event-form.svelte";
	import type { Event } from "$lib/map/event/types";
	import { getFormState } from "./state.svelte";
	import { FormAction } from "$lib/types";

	type Props = {
		event: Event;
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
				formState.data = {
                    event_id: props.event.event_id,
					name: props.event.name,
					start_at: new Date(props.event.start_at),
					end_at: new Date(props.event.end_at),
					description: props.event.description,
					venue_id: props.event.venue.venue_id
				};
                formState.isOpen = true
			}}
		>
			Edit
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
