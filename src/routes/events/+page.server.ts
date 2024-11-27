import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { valibot } from "sveltekit-superforms/adapters";
import {
	CreateEventOccurrenceSchema,
	CreateEventSchema
} from "$lib/map/event/schema";
import type { Actions } from "@sveltejs/kit";
import { getEvents } from "$lib/map/event/requests";

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";

	const events = await getEvents({ page, limit });

	return {
		events: events.data,
		form: await superValidate(valibot(CreateEventSchema)),
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

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/events`, {
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
	},
	createOccurrence: async (event) => {
		const form = await superValidate(
			event,
			valibot(CreateEventOccurrenceSchema)
		);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/event-occurrences`,
			{
				method: "POST",
				body: JSON.stringify(form.data),
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
	}
};
