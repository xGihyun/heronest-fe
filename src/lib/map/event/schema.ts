import * as v from "valibot";

export const CreateEventSchema = v.pipe(
	v.object({
		event_id: v.optional(v.string()),
		name: v.pipe(v.string(), v.nonEmpty()),
		description: v.nullable(v.string()),
		start_at: v.optional(v.date(), () => new Date()),
		end_at: v.optional(v.date(), () => new Date()),
		venue_id: v.pipe(v.string(), v.nonEmpty()),
		allow_visitors: v.optional(v.boolean(), false),
		image_url: v.optional(v.string()),
		image: v.nullable(
			v.pipe(
				v.file("Please select an image file."),
				v.mimeType(["image/jpeg", "image/png", "image/webp", "image/avif"])
			)
		)
	}),
	v.transform((input) => {
		if (input.start_at > input.end_at) {
			return {
				...input,
				start_at: input.end_at
			};
		}

		return input;
	})
);

export type CreateEventInput = v.InferInput<typeof CreateEventSchema>;
export type CreateEventOutput = v.InferOutput<typeof CreateEventSchema>;
