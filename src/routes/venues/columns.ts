import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte"
import type { Venue } from "$lib/map/venue/types";

export const columns: ColumnDef<Venue>[] = [
	{
		accessorKey: "name",
		header: "Name"
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
      // You can pass whatever you need from `row.original` to the component
      return renderComponent(DataTableActions, { venue: row.original });
    },
  },
];
