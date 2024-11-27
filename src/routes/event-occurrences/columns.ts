import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte";
import type { Event } from "$lib/map/event/types";

export const columns: ColumnDef<Event>[] = [
	{
		accessorKey: "name",
		header: "Name"
	},
	{
		accessorKey: "description",
		header: "Description"
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { id: row.original.event_id });
		}
	}
];
