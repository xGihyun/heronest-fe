<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { DateFormatter } from "@internationalized/date";
	import { formatUserName, getUserInitials } from "$lib/user/utils.js";
	import { UserRole, type User } from "$lib/user/types";
	import { EditIcon } from "$lib/icons";
	import { toast } from "svelte-sonner";
	import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
	import { invalidateAll } from "$app/navigation";
	import { getAuthContext } from "$lib/user/auth/context.svelte";

	type Props = {
		user: User;
	};

	let avatar: File | null = $state(null);

	let props: Props = $props();

	const df = new DateFormatter("en-US", {
		dateStyle: "long"
	});

	async function updateAvatar() {
		const response = await fetch(`/api/avatars`, {
			method: "POST",
			body: avatar
		});

		if (!response.ok) {
			toast.error("Failed to update avatar.");
			return;
		}

		const result: ApiResponse = await response.json();

		if (result.status !== ApiResponseStatus.Success) {
			toast.error(result.message);
			return;
		}

		toast.success(result.message);

		await invalidateAll();
	}

	const authContext = getAuthContext();

	const canChangeAvatar =
		props.user.role !== UserRole.Admin ||
		authContext.user?.user_id === props.user.user_id;
</script>

<Card.Root>
	<Card.Header class="items-center">
		<input
			type="file"
			id="avatar"
			hidden
			oninput={(e) => {
				avatar = e.currentTarget.files?.item(0) || null;
			}}
			onchange={updateAvatar}
			disabled={!canChangeAvatar}
		/>

		<label
			for="avatar"
			class={`relative ${canChangeAvatar ? "hover:cursor-pointer" : ""} `}
		>
			<Avatar.Root class="size-28">
				<Avatar.Image
					src={props.user.avatar_url !== null
						? `/storage/images/avatars/${props.user.avatar_url}`
						: null}
					alt={props.user?.email}
				/>
				<Avatar.Fallback class="bg-primary text-4xl text-primary-foreground">
					{getUserInitials(props.user)}
				</Avatar.Fallback>
			</Avatar.Root>

			{#if canChangeAvatar}
				<div
					class="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary shadow"
				>
					<EditIcon class="size-5 text-primary-foreground" />
				</div>
			{/if}
		</label>

		<Card.Title class="text-xl">{formatUserName(props.user!)}</Card.Title>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Body>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Name</Table.Cell>
					<Table.Cell>
						{formatUserName(props.user)}
					</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Email</Table.Cell>
					<Table.Cell>{props.user.email}</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Role</Table.Cell>
					<Table.Cell class="first-letter:uppercase"
						>{props.user.role}</Table.Cell
					>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Gender</Table.Cell>
					<Table.Cell class="first-letter:uppercase"
						>{props.user.sex}</Table.Cell
					>
				</Table.Row>
				<Table.Row>
					<Table.Cell class="w-40 font-inter-semibold">Birthday</Table.Cell>
					<Table.Cell>{df.format(new Date(props.user.birth_date))}</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
