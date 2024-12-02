import type { PageServerLoad } from "./$types";
import { getEvents } from "$lib/map/event/requests";
import { getSeats } from "$lib/map/seat/requests";
import { getUsers } from "$lib/user/requests";
import { valibot } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";
import { CreateSeatSchema } from "$lib/map/seat/schema";
import type { Actions } from "@sveltejs/kit";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { CreateTicketSchema } from "$lib/ticket/schema";
import type { CreateTicketResponse } from "$lib/ticket/types";

export const load: PageServerLoad = async ({ params, url }) => {
	const events = await getEvents({ venue_id: params.venueId });

	const eventId = url.searchParams.get("eventId") || events.data[0].event_id;

	const seats = await getSeats(params.venueId, eventId);
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

        console.log("Create:", form.data)

		if (
			!form.data.reserved_by.event_id ||
			!form.data.reserved_by.seat_id ||
			!form.data.reserved_by.user_id
		) {
			// @ts-expect-error If `reserved_by` has invalid values, set it to
			// `null` before sending it to the server.
			form.data.reserved_by = null;
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

		console.log(result);

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

		console.log("Reserve:", form.data);

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/tickets`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});
		const result: ApiResponse<CreateTicketResponse> = await response.json();

		return {
			form,
			result
		};
	}
};
