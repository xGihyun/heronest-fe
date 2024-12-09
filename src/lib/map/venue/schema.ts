import * as v from "valibot";

export const CreateVenueSchema = v.object({
    venue_id: v.optional(v.string()),
	name: v.pipe(v.string(), v.nonEmpty()),
	description: v.optional(v.string()),
	location: v.pipe(v.string(), v.nonEmpty()),
	image_url: v.nullable(v.string())
});

export type CreateVenueInput = v.InferInput<typeof CreateVenueSchema>;
export type CreateVenueOutput = v.InferOutput<typeof CreateVenueSchema>;
