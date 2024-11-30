import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { User } from "./types";

export async function getUser(userId: string): Promise<ApiResponse<User>> {
	const response = await fetch(`${PUBLIC_BACKEND_URL}/api/users/${userId}`, {
		method: "GET"
	});
	const result: ApiResponse<User> = await response.json();

	return result;
}
