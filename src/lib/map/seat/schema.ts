import * as v from "valibot";
import { SeatStatus } from "./types";
import { CreateTicketSchema } from "$lib/ticket/schema";
import { v4 as uuidv4 } from "uuid";

export const CreateSeatSchema = v.object({
	seat_id: v.optional(v.string(), uuidv4()),
	seat_number: v.pipe(v.string(), v.nonEmpty("Seat number is required.")),
	status: v.enum(SeatStatus),
	seat_section_id: v.nullable(v.string()),
	venue_id: v.pipe(v.string(), v.nonEmpty("Venue is required.")),
	metadata: v.any(),

	reserved_by: v.nullable(CreateTicketSchema)
});

export type CreateSeatInput = v.InferInput<typeof CreateSeatSchema>;
export type CreateSeatOutput = v.InferOutput<typeof CreateSeatSchema>;
