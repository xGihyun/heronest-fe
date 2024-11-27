import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { Seat } from "$lib/map/seat/types";
import { getVenues } from "$lib/map/venue/requests";
import type { PageLoad } from "./$types";

export const csr = true;
export const ssr = false;

export const load: PageLoad = async () => {
	const venues = await getVenues();
    const seats = await getSeats("efd19847-21a4-413e-b08a-b721ea2560e7")

	return {
		venues: venues.data,
        seats: seats.data
	};
};

async function getSeats(venueId: string): Promise<ApiResponse<Seat[]>> {
	const response = await fetch(`${PUBLIC_BACKEND_URL}/api/seats?venueId=${venueId}`, {
		method: "GET"
	});

	const result: ApiResponse<Seat[]> = await response.json();

	return result;
}
