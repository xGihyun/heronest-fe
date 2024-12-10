<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import type { User } from "$lib/user/types";
	import { formatUserName, getUserInitials } from "$lib/user/utils";

	type Props = {
		user: User;
	};

	let props: Props = $props();
</script>

<a
	href={`/users/${props.user.user_id}`}
	class="flex items-center gap-2 font-inter-semibold"
>
	<Avatar.Root>
		<Avatar.Image src={props.user.avatar_url} alt={props.user.email} />
		<Avatar.Fallback class="bg-background">
			{getUserInitials(props.user)}
		</Avatar.Fallback>
	</Avatar.Root>

	<p class="text-primary underline">
		{formatUserName(props.user, "lf")}
	</p>
</a>
