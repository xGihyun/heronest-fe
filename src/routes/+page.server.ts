import type { ApiResponse } from "$lib/api/types";
import { getEvents } from "$lib/map/event/requests";
import { getTickets } from "$lib/ticket/requests";
import type { Ticket } from "$lib/ticket/types";
import { UserRole } from "$lib/user/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const events = await getEvents();

	let tickets: ApiResponse<Ticket[]>;

	if (locals.user?.role === UserRole.Admin) {
		tickets = await getTickets();
	} else {
		tickets = await getTickets({ userId: locals.user!.user_id });
	}

	return {
		events: events.data,
		tickets: tickets.data
	};
};
