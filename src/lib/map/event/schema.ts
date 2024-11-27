import * as v from "valibot";

export const CreateEventSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty()),
	description: v.optional(v.string())
});

export type CreateEventInput = v.InferInput<typeof CreateEventSchema>;

export const CreateEventOccurrenceSchema = v.object({
	start_at: v.optional(v.date(), () => new Date()),
	end_at: v.optional(v.date(), () => new Date()),
	event_id: v.pipe(v.string(), v.nonEmpty()),
	venue_id: v.pipe(v.string(), v.nonEmpty())
});

export type CreateEventOccurrenceInput = v.InferInput<
	typeof CreateEventOccurrenceSchema
>;
