import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { type Seat } from "./types";

export function handleClick(): void {
	console.log("Seat clicked!");
}

export async function handleSave(
	seats: Seat[],
	venueId: string
): Promise<ApiResponse> {
	const response = await fetch(
		`${PUBLIC_BACKEND_URL}/api/venues/${venueId}/seats`,
		{
			method: "POST",
			body: JSON.stringify(seats),
			headers: {
				"Content-Type": "application/json"
			}
		}
	);

	const result: ApiResponse = await response.json();

	return result;
}
