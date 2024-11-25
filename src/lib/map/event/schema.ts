import * as v from "valibot";

export const CreateEventSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty()),
	description: v.optional(v.string()),
});

export type CreateEventInput = v.InferInput<typeof CreateEventSchema>;
