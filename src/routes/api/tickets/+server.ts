import type { RequestHandler } from "./$types";
import { getTicketByNumber } from "$lib/ticket/requests";
import {
    PUBLIC_BACKEND_URL,
} from "$env/static/public";
import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
import { error } from "@sveltejs/kit";
import type { SeatReservation } from "$lib/map/seat/types";

export const POST: RequestHandler = async ({ request, fetch }) => {
	const reservedTicket: SeatReservation = await request.json();

	const ticket = await getTicketByNumber(reservedTicket.ticket_number);

	if (ticket.status !== ApiResponseStatus.Success) {
		throw error(ticket.status_code, ticket.message);
	}

    const response = await fetch(`${PUBLIC_BACKEND_URL}/api/tickets/${ticket.data.ticket_number}/pdf`,{
        method: "POST",
        body: JSON.stringify(ticket.data),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const result: ApiResponse = await response.json()

	console.log(result.message);

	return new Response();
};
