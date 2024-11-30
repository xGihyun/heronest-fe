import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse, PaginationResult } from "$lib/api/types";
import type { Event } from "./types";

type GetEventFilter = {
	venue_id?: string;
} & PaginationResult;

export async function getEvents(
	filter?: GetEventFilter
): Promise<ApiResponse<Event[]>> {
	const params = new URLSearchParams();
	const endpoint = `${PUBLIC_BACKEND_URL}/api/events`;

	if (filter) {
		if (filter.page) {
			params.set("page", String(filter.page));
		}
		if (filter.limit) {
			params.set("limit", String(filter.limit));
		}
		if (filter.venue_id) {
			params.set("venueId", String(filter.venue_id));
		}
	}

	const fullEndpoint = params.toString()
		? `${endpoint}?${params.toString()}`
		: endpoint;

	const response = await fetch(fullEndpoint, {
		method: "GET"
	});
	const result: ApiResponse<Event[]> = await response.json();

	return result;
}
