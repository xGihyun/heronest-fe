import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import type { Venue } from "$lib/map/venue/types";
import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { valibot } from "sveltekit-superforms/adapters";
import { CreateVenueSchema } from "$lib/map/venue/schema";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(valibot(CreateVenueSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, valibot(CreateVenueSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/venues`, {
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
	edit: async (event) => {
		const form = await superValidate(event, valibot(CreateVenueSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/venues/${form.data.venue_id}`, {
			method: "PATCH",
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
