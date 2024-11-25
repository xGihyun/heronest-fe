import type { CreateEventInput } from "./schema";

export type Event = {
	event_id: string;
} & CreateEventInput;
