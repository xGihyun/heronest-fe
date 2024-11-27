import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse, PaginationResult } from "$lib/api/types";
import type { Venue } from "./types";

export async function getVenues(
	pagination?: PaginationResult
): Promise<ApiResponse<Venue[]>> {
	let endpoint = `${PUBLIC_BACKEND_URL}/api/venues`;

	if (pagination) {
		endpoint += `?page=${pagination.page}&limit=${pagination.limit}`;
	}

	const response = await fetch(endpoint, {
		method: "GET"
	});

	const result: ApiResponse<Venue[]> = await response.json();

	return result;
}
