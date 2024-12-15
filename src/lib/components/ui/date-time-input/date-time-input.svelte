<script lang="ts">
	import { cn } from "$lib/utils";
	import type { WithElementRef } from "bits-ui";
	import { format, isValid, parse } from "date-fns";
	import type { HTMLInputAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(new Date()),
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes> = $props();

	let inputFormat = $derived(
		restProps.type === "date" ? "yyyy-MM-dd" : "yyyy-MM-dd'T'HH:mm"
	);
	let formattedValue = $derived(format(value, inputFormat));

	function handleInput(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		const parsedDate = parse(inputElement.value, inputFormat, new Date());

		if (isValid(parsedDate)) {
			value = parsedDate;
		}
	}
</script>

<input
	type={restProps.type || "datetime-local"}
	bind:this={ref}
	value={formattedValue}
	class={cn(
		"flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	step={restProps.type === "datetime-local" ? "60" : undefined}
	oninput={handleInput}
	{...restProps}
/>
