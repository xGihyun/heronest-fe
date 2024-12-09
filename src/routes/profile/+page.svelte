<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { DateFormatter } from "@internationalized/date";
	import { formatUserName, getUserInitials } from "$lib/user/utils.js";

	let { data } = $props();

	const df = new DateFormatter("en-US", {
		dateStyle: "long"
	});
</script>

<div class="mx-auto max-w-screen-sm">
	<Card.Root>
		<Card.Header class="items-center">
			<Avatar.Root class="size-28">
				<Avatar.Image src={data.user?.avatar_url} alt={data.user?.email} />
				<Avatar.Fallback class="bg-foreground text-background text-4xl">
					{getUserInitials(data.user!)}
				</Avatar.Fallback>
			</Avatar.Root>

			<Card.Title class="text-xl">{formatUserName(data.user!)}</Card.Title>
		</Card.Header>

		<Card.Content>
			<Table.Root>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="font-inter-semibold w-40">Name</Table.Cell>
						<Table.Cell>{data.user?.first_name} {data.user?.last_name}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-inter-semibold w-40">Email</Table.Cell>
						<Table.Cell>{data.user?.email} </Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-inter-semibold w-40">Role</Table.Cell>
						<Table.Cell>{data.user?.role} </Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-inter-semibold w-40">Birthday</Table.Cell>
						<Table.Cell>{df.format(new Date(data.user!.birth_date))}</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
