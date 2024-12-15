import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { Seat } from "./types";

export async function getSeats(
	venueId: string,
	eventId?: string
): Promise<ApiResponse<Seat[]>> {
	const params = new URLSearchParams();

	if (eventId) {
		params.set("eventId", eventId);
	}

	const endpoint = `${PUBLIC_BACKEND_URL}/api/venues/${venueId}/seats`;

	const fullEndpoint = params.toString()
		? `${endpoint}?${params.toString()}`
		: endpoint;

	const response = await fetch(fullEndpoint, {
		method: "GET"
	});

	const result: ApiResponse<Seat[]> = await response.json();

	return result;
}
