import { getEvents } from "$lib/map/event/requests";
import { getTickets } from "$lib/ticket/requests";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const events = await getEvents()
    const tickets = await getTickets()

	return {
		events: events.data,
        tickets: tickets.data
	};
};
