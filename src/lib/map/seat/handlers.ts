import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { Group } from "konva/lib/Group";
import { SeatStatus, type CreateSeatRequest } from "./types";

export function handleClick(): void {
	console.log("Seat clicked!");
}

// TODO: Dynamic venueId
export async function handleSave(group: Group): Promise<ApiResponse> {
	const seatNodes = group.find(".seat");
	const seats: CreateSeatRequest[] = [];

	seatNodes.forEach((node, i) => {
		const metadata = JSON.parse(node.toJSON());
		const seat: CreateSeatRequest = {
			status: SeatStatus.Available,
			metadata,
			venue_id: "efd19847-21a4-413e-b08a-b721ea2560e7",
			seat_number: (i + 1).toString()
		};

		seats.push(seat);
	});

	const response = await fetch(`${PUBLIC_BACKEND_URL}/api/seats`, {
		method: "POST",
		body: JSON.stringify(seats),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const result: ApiResponse = await response.json();

    return result
}
