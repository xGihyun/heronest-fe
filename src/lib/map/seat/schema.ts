import * as v from "valibot";
import { SeatStatus } from "./types";
import { v4 as uuidv4 } from "uuid";

const ReservedTicketSchema = v.object({
	user_id: v.string(),
	seat_id: v.string(),
	event_id: v.string(),
	metadata: v.nullable(v.any())
});

export const CreateSeatSchema = v.object({
	seat_id: v.optional(v.string(), uuidv4()),
	seat_number: v.pipe(v.string(), v.nonEmpty("Seat number is required.")),
	status: v.enum(SeatStatus),
	seat_section_id: v.nullable(v.string()),
	venue_id: v.pipe(v.string(), v.nonEmpty("Venue is required.")),
	metadata: v.any(),

	reserved_by: ReservedTicketSchema
});

export type CreateSeatInput = v.InferInput<typeof CreateSeatSchema>;
export type CreateSeatOutput = v.InferOutput<typeof CreateSeatSchema>;
