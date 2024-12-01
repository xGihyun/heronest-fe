import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { Seat } from "./types";

export async function getSeats(venueId: string): Promise<ApiResponse<Seat[]>> {
	const response = await fetch(
		`${PUBLIC_BACKEND_URL}/api/venues/${venueId}/seats`,
		{
			method: "GET"
		}
	);

	const result: ApiResponse<Seat[]> = await response.json();

	return result;
}
