import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte";
import type { Event } from "$lib/map/event/types";
import { DateFormatter } from "@internationalized/date";
import MapLink from "./map-link.svelte";

const df = new DateFormatter("en-US", {
	dateStyle: "medium",
	timeStyle: "short"
});

export const columns: ColumnDef<Event>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			return renderComponent(MapLink, { event: row.original });
		}
	},
	{
		accessorKey: "venue.name",
		header: "Venue"
	},
	{
		header: "Date",
		accessorFn: (event) => {
			const eventDate = df.formatRange(
				new Date(event.start_at),
				new Date(event.end_at)
			);
			return eventDate;
		}
	},
	{
		accessorKey: "allow_visitors",
		header: "Visitors Allowed",
		accessorFn: (event) => {
			if (event.allow_visitors) {
				return "Yes";
			}

			return "No";
		}
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { event: row.original });
		}
	}
];
