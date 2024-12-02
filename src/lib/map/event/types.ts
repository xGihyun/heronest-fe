import type { Venue } from "../venue/types";
import type { CreateEventOutput } from "./schema";

export type Event = {
	event_id: string;
    venue: Venue,
    image_url?: string;
} & Omit<CreateEventOutput, 'venue_id'>;
