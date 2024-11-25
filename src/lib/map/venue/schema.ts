import * as v from "valibot";

export const CreateVenueSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty()),
	description: v.optional(v.string()),
	capacity: v.number(),
	location: v.pipe(v.string(), v.nonEmpty()),
	image_url: v.optional(v.string())
});

export type CreateVenueInput = v.InferInput<typeof CreateVenueSchema>;
