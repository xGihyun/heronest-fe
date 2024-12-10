import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte";
import type { User } from "$lib/user/types";
import UserLink from "./user-link.svelte"

export const columns: ColumnDef<User>[] = [
	{
		header: "Name",
		cell: ({ row }) => {
			return renderComponent(UserLink, { user: row.original });
		}
	},
	{
		accessorKey: "email",
		header: "Email"
	},
	{
		accessorKey: "role",
		header: "Role"
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return renderComponent(DataTableActions, { user: row.original });
		}
	}
];
