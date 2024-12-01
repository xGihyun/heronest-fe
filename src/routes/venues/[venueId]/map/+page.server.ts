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

export const load: PageServerLoad = async ({ params }) => {
	const seats = await getSeats(params.venueId);
	const events = await getEvents({ venue_id: params.venueId });
	const users = await getUsers();

	return {
		seats: seats.data,
		events: events.data,
		users: users.data,
		form: await superValidate(valibot(CreateSeatSchema))
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

        console.log(form.data)

        const response = await fetch(`${PUBLIC_BACKEND_URL}/api/venues/${form.data.venue_id}/seats`, {
            method: "POST",
            body: JSON.stringify([form.data]),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result: ApiResponse = await response.json()

        console.log(result)

		return {
			form,
            result
		};
	}
};
