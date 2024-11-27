import * as v from "valibot";

export const CreateEventSchema = v.object({
    event_id: v.optional(v.string()),
    name: v.pipe(v.string(), v.nonEmpty()),
	description: v.optional(v.string()),
	start_at: v.optional(v.date(), () => new Date()),
	end_at: v.optional(v.date(), () => new Date()),
	venue_id: v.pipe(v.string(), v.nonEmpty())
});

export type CreateEventInput = v.InferInput<typeof CreateEventSchema>;
export type CreateEventOutput = v.InferOutput<typeof CreateEventSchema>;
