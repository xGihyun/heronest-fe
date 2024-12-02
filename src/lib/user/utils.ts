import type { User, UserDetail } from "./types";

export function formatUserName(
	user: User | UserDetail,
	variant: "fl" | "lf" = "fl"
): string {
	if (variant === "lf") {
		return `${user.last_name}, ${user.first_name}`;
	}

	return `${user.first_name} ${user.last_name}`;
}
