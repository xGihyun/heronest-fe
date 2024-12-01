import * as v from "valibot";

export const CreateTicketSchema = v.object({
	user_id: v.pipe(v.string(), v.nonEmpty("User is required.")),
	seat_id: v.pipe(v.string(), v.nonEmpty("Seat is required.")),
	event_id: v.pipe(v.string(), v.nonEmpty("Event is required.")),
	metadata: v.nullable(v.any())
});

export type CreateTicketInput = v.InferInput<typeof CreateTicketSchema>;
