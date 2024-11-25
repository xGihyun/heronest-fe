import { BACKEND_URL } from "$env/static/private";
import type { ApiResponse } from "$lib/api/types";
import type { Venue } from "$lib/map/venue/types";
import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { valibot } from "sveltekit-superforms/adapters";
import { CreateVenueSchema } from "$lib/map/venue/schema";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";

	const response = await fetch(
		`${BACKEND_URL}/api/venues?page=${page}&limit=${limit}`,
		{
			method: "GET"
		}
	);
	const result: ApiResponse<Venue[]> = await response.json();

	return {
		venues: result.data,
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

		const response = await fetch(`${BACKEND_URL}/api/venues`, {
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
