import type { PaginationQuery } from "$lib/api/types";
import type { EventBriefDetail } from "$lib/map/event/types";
import type { SeatBriefDetail } from "$lib/map/seat/types";
import type { VenueBriefDetail } from "$lib/map/venue/types";
import type { UserBriefDetail } from "$lib/user/types";

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

export type GetTicketFilter = {
	eventId?: string;
    userId?: string
} & PaginationQuery;

