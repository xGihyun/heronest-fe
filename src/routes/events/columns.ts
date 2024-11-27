import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte";
import type { Event } from "$lib/map/event/types";
import { DateFormatter } from "@internationalized/date";

const df = new DateFormatter("en-US", {
	dateStyle: "medium"
});

export const columns: ColumnDef<Event>[] = [
	{
		accessorKey: "name",
		header: "Name"
	},
	{
		accessorKey: "venue.name",
		header: "Venue"
	},
	{
		header: "Start",
		accessorFn: (event) => {
			return df.format(new Date(event.start_at));
		}
	},
	{
		header: "End",
		accessorFn: (event) => {
			return df.format(new Date(event.end_at));
		}
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { event: row.original });
		}
	}
];
