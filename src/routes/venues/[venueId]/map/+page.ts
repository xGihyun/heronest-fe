import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { getEvents } from "$lib/map/event/requests";
import type { Seat } from "$lib/map/seat/types";
import type { PageLoad } from "./$types";

export const csr = true;
export const ssr = false;

export const load: PageLoad = async ({ params }) => {
	const seats = await getSeats(params.venueId);
	const events = await getEvents({ venue_id: params.venueId });

    console.log(events)

	return {
		seats: seats.data,
		venueId: params.venueId,
        events: events.data
	};
};

async function getSeats(venueId: string): Promise<ApiResponse<Seat[]>> {
	const response = await fetch(
		`${PUBLIC_BACKEND_URL}/api/venues/${venueId}/seats`,
		{
			method: "GET"
		}
	);

	const result: ApiResponse<Seat[]> = await response.json();

	return result;
}
