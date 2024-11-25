import type { CreateVenueInput } from "./schema";

export type Venue = {
	venue_id: string;
} & CreateVenueInput;
