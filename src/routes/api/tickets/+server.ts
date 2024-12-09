import type { RequestHandler } from "./$types";
import { getTicketByNumber } from "$lib/ticket/requests";
import { generateTicketPdf } from "$lib/ticket/qrcode";
import {
	PUBLIC_TICKET_DIRECTORY,
	PUBLIC_TICKET_TEMPLATE_DIRECTORY
} from "$env/static/public";
import { ApiResponseStatus } from "$lib/api/types";
import { error } from "@sveltejs/kit";
import type { SeatReservation } from "$lib/map/seat/types";

export const POST: RequestHandler = async ({ request, fetch }) => {
	const reservedTicket: SeatReservation = await request.json();

	const ticket = await getTicketByNumber(reservedTicket.ticket_number);

	if (ticket.status !== ApiResponseStatus.Success) {
		throw error(ticket.status_code, ticket.message);
	}

	await generateTicketPdf(
		PUBLIC_TICKET_TEMPLATE_DIRECTORY,
		PUBLIC_TICKET_DIRECTORY,
		ticket.data,
		fetch
	);

	console.log("Successfully generated ticket PDF.");

	return new Response();
};
