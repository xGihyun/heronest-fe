import { BACKEND_URL } from "$env/static/private";
import type { ApiResponse } from "$lib/api/types";
import type { Event } from "$lib/map/event/types";
import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { valibot } from "sveltekit-superforms/adapters";
import { CreateEventSchema } from "$lib/map/event/schema";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";

	const response = await fetch(
		`${BACKEND_URL}/api/events?page=${page}&limit=${limit}`,
		{
			method: "GET"
		}
	);
	const result: ApiResponse<Event[]> = await response.json();

	return {
		venues: result.data,
		form: await superValidate(valibot(CreateEventSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, valibot(CreateEventSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(`${BACKEND_URL}/api/events`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const result: ApiResponse = await response.json();

		return {
			form,
			result
		};
	}
};
