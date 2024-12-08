import type { CreateVenueInput } from "./schema";

export type Venue = {
	venue_id: string;
} & CreateVenueInput;

export type VenueBriefDetail = {
    venue_id: string;
    name: string;
}
