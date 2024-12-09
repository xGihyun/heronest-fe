import type { PageServerLoad } from "./$types";
import { getEvents } from "$lib/map/event/requests";
import { getSeats } from "$lib/map/seat/requests";
import { getUsers } from "$lib/user/requests";
import { valibot } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";
import { CreateSeatSchema } from "$lib/map/seat/schema";
import type { Actions } from "@sveltejs/kit";
import {
	PUBLIC_BACKEND_URL,
	PUBLIC_TICKET_DIRECTORY,
	PUBLIC_TICKET_TEMPLATE_DIRECTORY
} from "$env/static/public";
import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
import { CreateTicketSchema } from "$lib/ticket/schema";
import { generateTicketPdf } from "$lib/ticket/qrcode";
import type { Ticket } from "$lib/ticket/types";

export const load: PageServerLoad = async ({ params, url }) => {
	const events = await getEvents({ venue_id: params.venueId });

	const eventId = url.searchParams.get("eventId");

	const seats = await getSeats(params.venueId, eventId || undefined);
	const users = await getUsers();

	return {
		seats: seats.data,
		events: events.data,
		users: users.data,
		form: await superValidate(valibot(CreateSeatSchema)),
		ticketForm: await superValidate(valibot(CreateTicketSchema)),
		eventId: eventId
	};
};

export const actions: Actions = {
	createSeat: async (event) => {
		const form = await superValidate(event, valibot(CreateSeatSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.debug("Create seat:", form.data);

        // NOTE: This is pretty bad
		if (
			!form.data.reservation.event_id ||
			!form.data.reservation.user_id
		) {
			if (form.data.reservation) {
				return fail(400, {
					form
				});
			}

			// @ts-expect-error If `reservation` has invalid values, set it to
			// `null` before sending it to the server.
			form.data.reservation = null;
		}

		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/venues/${form.data.venue_id}/seats`,
			{
				method: "POST",
				body: JSON.stringify([form.data]),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
		const result: ApiResponse = await response.json();

		console.debug("Created seat:", result);

		return {
			form,
			result
		};
	},
	reserveSeat: async (event) => {
		const form = await superValidate(event, valibot(CreateTicketSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.debug("Reserve seat:", form.data);

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/tickets`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const result: ApiResponse<Ticket> = await response.json();

        console.debug("Reserved seat:", result)

		if (result.status === ApiResponseStatus.Success) {
			await generateTicketPdf(
				PUBLIC_TICKET_TEMPLATE_DIRECTORY,
				PUBLIC_TICKET_DIRECTORY,
				result.data,
                event.fetch
			);

            console.debug("Successfully generated ticket PDF.")
		}

		return {
			form,
			result
		};
	}
};
