import type { CreateVenueInput } from "./schema";

export type Venue = {
	venue_id: string;
    capacity: number;
} & CreateVenueInput;

export type VenueBriefDetail = {
    venue_id: string;
    name: string;
}
