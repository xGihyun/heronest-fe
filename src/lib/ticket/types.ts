import type { UserDetail } from "$lib/user/types";

export type CreateTicketResponse = {
	ticket_id: string;
	ticket_number: string;
};

export type GetTicketResponse = {
	ticket_id: string;
	ticket_number: string;
	created_at: string;
	venue: {
		venue_id: string;
		name: string;
	};
	event: {
		event_id: string;
		name: string;
		start_at: string;
		end_at: string;
	};
	user: {
		user_id: string;
	} & UserDetail;
    seat: {
        seat_id: string;
        seat_number: string;
    }
};
