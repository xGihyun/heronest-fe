import type { UserBriefDetail } from "$lib/user/types";
import type { EventBriefDetail } from "../event/types";
import type { VenueBriefDetail } from "../venue/types";

//export enum SeatStatus {
//	Reserved = "reserved",
//	Available = "available",
//	Unavailable = "unavailable"
//}

export type Seat = {
	seat_id: string;
	seat_number: string;
	seat_section_id?: string;
	venue_id: string;
	metadata: object;

	reservation?: SeatReservation;
};

export type SeatReservation = {
	reserved_at: string;
	ticket_number: string;
	//venue: VenueBriefDetail;
	event: EventBriefDetail;
	user: UserBriefDetail;
};

export type SeatBriefDetail = {
	seat_id: string;
	seat_number: string;
};
