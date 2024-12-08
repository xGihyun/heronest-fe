import type { Venue } from "../venue/types";
import type { CreateEventOutput } from "./schema";

export type Event = {
	event_id: string;
	venue: Venue;
} & Omit<CreateEventOutput, "venue_id" | "image">;

export type EventBriefDetail = {
	event_id: string;
	name: string;
	start_at: string;
	end_at: string;
};
