import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte";
import type { Venue } from "$lib/map/venue/types";
import MapLink from "./map-link.svelte";

export const columns: ColumnDef<Venue>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			return renderComponent(MapLink, { venue: row.original });
		}
	},
	{
		accessorKey: "description",
		header: "Description"
	},
	{
		accessorKey: "capacity",
		header: "Capacity"
	},
	{
		accessorKey: "location",
		header: "Location"
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { venue: row.original });
		}
	}
];
