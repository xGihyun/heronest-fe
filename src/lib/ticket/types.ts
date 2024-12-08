import type { EventBriefDetail } from "$lib/map/event/types";
import type { SeatBriefDetail } from "$lib/map/seat/types";
import type { VenueBriefDetail } from "$lib/map/venue/types";
import type { UserBriefDetail } from "$lib/user/types";

export type CreateTicketResponse = {
	ticket_id: string;
	ticket_number: string;
};

//export type GetTicketResponse = {
//	ticket_id: string;
//	ticket_number: string;
//	created_at: string;
//	venue: {
//		venue_id: string;
//		name: string;
//	};
//	event: {
//		event_id: string;
//		name: string;
//		start_at: string;
//		end_at: string;
//	};
//	user: {
//		user_id: string;
//	} & UserDetail;
//	seat: {
//		seat_id: string;
//		seat_number: string;
//	};
//};

export enum TicketStatus {
    Reserved = "reserved",
    Used = "used",
    Canceled = "canceled"
}

export type Ticket = {
	ticket_id: string;
	ticket_number: string;
	reserved_at: string;
    status: TicketStatus;
	reservation: TicketReservation;
};

type TicketReservation = {
	venue: VenueBriefDetail;
	event: EventBriefDetail;
	user: UserBriefDetail;
	seat: SeatBriefDetail;
};
