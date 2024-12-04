import type { UserDetail } from "$lib/user/types";

export enum SeatStatus {
	Reserved = "reserved",
	Available = "available",
	Unavailable = "unavailable"
}

export type Seat = {
	seat_id: string;
	seat_number: string;
	status: SeatStatus;
	seat_section_id?: string;
	venue_id: string;
	metadata: object;

	reserved_by?: SeatReservedBy;
};

export type SeatReservedBy = {
	user: UserDetail & { user_id: string };
	event: ReservedSeatEventDetail;
    ticket: ReservedTicketDetail;
};

export type ReservedSeatEventDetail = {
	event_id: string;
	name: string;
};

export type ReservedTicketDetail = {
    ticket_number: string;
}

//export type CreateSeatRequest = {
//	seat_number: string;
//	status: SeatStatus;
//	seat_section_id?: string;
//	venue_id: string;
//	metadata: object;
//};
