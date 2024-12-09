import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse, PaginationQuery } from "$lib/api/types";
import type { CreateTicketInput } from "./schema";
import type { GetTicketFilter, Ticket } from "./types";

export async function createTicket(
	data: CreateTicketInput
): Promise<ApiResponse<Ticket>> {
	const response = await fetch(`${PUBLIC_BACKEND_URL}/api/tickets`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const result: ApiResponse<Ticket> = await response.json();

	return result;
}

export async function getTickets(
	filter?: GetTicketFilter
): Promise<ApiResponse<Ticket[]>> {
	const params = new URLSearchParams();
	const endpoint = `${PUBLIC_BACKEND_URL}/api/tickets`;

	if (filter) {
		if (filter.page) {
			params.set("page", String(filter.page));
		}
		if (filter.limit) {
			params.set("limit", String(filter.limit));
		}
		if (filter.eventId) {
			params.set("eventId", String(filter.eventId));
		}
		if (filter.userId) {
			params.set("eventId", String(filter.eventId));
		}
	}

	const fullEndpoint = params.toString()
		? `${endpoint}?${params.toString()}`
		: endpoint;

	const response = await fetch(fullEndpoint, {
		method: "GET"
	});

	const result: ApiResponse<Ticket[]> = await response.json();

	return result;
}

export async function getTicketByNumber(
	ticketNumber: string
): Promise<ApiResponse<Ticket>> {
	const response = await fetch(
		`${PUBLIC_BACKEND_URL}/api/tickets/${ticketNumber}`,
		{
			method: "GET"
		}
	);

	const result: ApiResponse<Ticket> = await response.json();

	return result;
}
