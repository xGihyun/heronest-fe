import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse, PaginationResult } from "$lib/api/types";
import type { Venue } from "./types";

type GetVenueFilter = {
	name?: string;
} & PaginationResult;

export async function getVenues(
	filter?: GetVenueFilter
): Promise<ApiResponse<Venue[]>> {
	const params = new URLSearchParams();
	const endpoint = `${PUBLIC_BACKEND_URL}/api/venues`;

	if (filter) {
		if (filter.page) {
			params.set("page", String(filter.page));
		}
		if (filter.limit) {
			params.set("limit", String(filter.limit));
		}
		if (filter.name) {
			params.set("name", String(filter.name));
		}
	}

	const fullEndpoint = params.toString()
		? `${endpoint}?${params.toString()}`
		: endpoint;

	const response = await fetch(fullEndpoint, {
		method: "GET"
	});

	const result: ApiResponse<Venue[]> = await response.json();

	return result;
}
