import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse, PaginationResult } from "$lib/api/types";
import type { User } from "./types";

export async function getUser(userId: string): Promise<ApiResponse<User>> {
	const response = await fetch(`${PUBLIC_BACKEND_URL}/api/users/${userId}`, {
		method: "GET"
	});
	const result: ApiResponse<User> = await response.json();

	return result;
}

export async function getUsers(
	filter?: PaginationResult
): Promise<ApiResponse<User[]>> {
	const params = new URLSearchParams();
	const endpoint = `${PUBLIC_BACKEND_URL}/api/users`;

	if (filter) {
		if (filter.page) {
			params.set("page", String(filter.page));
		}
		if (filter.limit) {
			params.set("limit", String(filter.limit));
		}
	}

	const fullEndpoint = params.toString()
		? `${endpoint}?${params.toString()}`
		: endpoint;

	const response = await fetch(fullEndpoint, {
		method: "GET"
	});
	const result: ApiResponse<User[]> = await response.json();

	return result;
}
