import type { ApiResponse } from "$lib/api/types";
import { getEvents } from "$lib/map/event/requests";
import { getTickets, getUserTickets } from "$lib/ticket/requests";
import type { GetTicketResponse } from "$lib/ticket/types";
import { UserRole } from "$lib/user/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
	const events = await getEvents();

	let tickets: ApiResponse<GetTicketResponse[]>;

	if (locals.user?.role === UserRole.Admin) {
		tickets = await getTickets();
	} else {
		tickets = await getUserTickets(locals.user?.user_id);
	}

	return {
		events: events.data,
		tickets: tickets.data
	};
};
