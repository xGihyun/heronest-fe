<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		inset,
		...restProps
	}: DropdownMenuPrimitive.ItemProps & {
		inset?: boolean;
	} = $props();
</script>

<DropdownMenuPrimitive.Item
	bind:ref
	class={cn(
		`relative flex cursor-default select-none items-center gap-2 rounded-sm px-3 py-2 outline-none transition-colors hover:cursor-pointer data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0`,
		inset && "pl-8",
		className
	)}
	{...restProps}
	{...restProps}
></DropdownMenuPrimitive.Item>
