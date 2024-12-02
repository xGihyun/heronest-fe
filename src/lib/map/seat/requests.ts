import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { Seat } from "./types";

export async function getSeats(venueId: string, eventId: string): Promise<ApiResponse<Seat[]>> {
	const params = new URLSearchParams();

    params.set("eventId", eventId)

	const response = await fetch(
		`${PUBLIC_BACKEND_URL}/api/venues/${venueId}/seats?${params.toString()}`,
		{
			method: "GET"
		}
	);

	const result: ApiResponse<Seat[]> = await response.json();

	return result;
}
