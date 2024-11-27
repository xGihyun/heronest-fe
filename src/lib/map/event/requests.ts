import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse, PaginationResult } from "$lib/api/types";
import type { Event } from "./types";

export async function getEvents(
	pagination?: PaginationResult
): Promise<ApiResponse<Event[]>> {
	let endpoint = `${PUBLIC_BACKEND_URL}/api/events`;

	if (pagination) {
		endpoint += `?page=${pagination.page}&limit=${pagination.limit}`;
	}

	const response = await fetch(endpoint, {
		method: "GET"
	});
	const result: ApiResponse<Event[]> = await response.json();

	return result;
}
