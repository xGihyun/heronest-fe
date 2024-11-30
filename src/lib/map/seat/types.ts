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
};

//export type CreateSeatRequest = {
//	seat_number: string;
//	status: SeatStatus;
//	seat_section_id?: string;
//	venue_id: string;
//	metadata: object;
//};
