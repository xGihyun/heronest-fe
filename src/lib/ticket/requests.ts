import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { CreateTicketInput } from "./schema";
import type { CreateTicketResponse, GetTicketResponse } from "./types";

export async function createTicket(
	data: CreateTicketInput
): Promise<ApiResponse<CreateTicketResponse>> {
	const response = await fetch(`${PUBLIC_BACKEND_URL}/api/tickets`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const result: ApiResponse<CreateTicketResponse> = await response.json();

	return result;
}

export async function getTickets(): Promise<ApiResponse<GetTicketResponse[]>> {
	const response = await fetch(`${PUBLIC_BACKEND_URL}/api/tickets`, {
		method: "GET"
	});

	const result: ApiResponse<GetTicketResponse[]> = await response.json();

	return result;
}
