<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { DateFormatter } from "@internationalized/date";
	import { formatUserName, getUserInitials } from "$lib/user/utils.js";
	import type { User } from "$lib/user/types";

	type Props = {
		user: User;
	};

	let props: Props = $props();

	const df = new DateFormatter("en-US", {
		dateStyle: "long"
	});
</script>

<Card.Root>
	<Card.Header class="items-center">
		<Avatar.Root class="size-28">
			<Avatar.Image src={props.user.avatar_url} alt={props.user?.email} />
			<Avatar.Fallback class="bg-foreground text-4xl text-background">
				{getUserInitials(props.user)}
			</Avatar.Fallback>
		</Avatar.Root>

		<Card.Title class="text-xl">{formatUserName(props.user!)}</Card.Title>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Name</Table.Cell>
					<Table.Cell
						>{props.user.first_name} {props.user?.last_name}</Table.Cell
					>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Email</Table.Cell>
					<Table.Cell>{props.user.email}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Role</Table.Cell>
					<Table.Cell>{props.user.role}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Birthday</Table.Cell>
					<Table.Cell>{df.format(new Date(props.user.birth_date))}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
