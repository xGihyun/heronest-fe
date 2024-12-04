import { PUBLIC_BACKEND_URL, PUBLIC_IMAGE_DIRECTORY } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { fail, superValidate, withFiles } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { valibot } from "sveltekit-superforms/adapters";
import { CreateEventSchema } from "$lib/map/event/schema";
import type { Actions } from "@sveltejs/kit";
import { getEvents } from "$lib/map/event/requests";
import { getVenues } from "$lib/map/venue/requests";
import { convertToSlug, saveFile } from "$lib/utils";

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";
	const name = url.searchParams.get("name") || undefined;

	const events = await getEvents({ page, limit, name });
	const venues = await getVenues();

	return {
		events: events.data,
		venues: venues.data,
		form: await superValidate(valibot(CreateEventSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, valibot(CreateEventSchema));
		if (!form.valid) {
			return fail(
				400,
				withFiles({
					form
				})
			);
		}

		console.log(form.data);

		if (form.data.image) {
			const imageUrl = await saveFile(
				form.data.image,
				PUBLIC_IMAGE_DIRECTORY,
				convertToSlug(form.data.name)
			);

			form.data.image_url = imageUrl;
		}

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/events`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const result: ApiResponse = await response.json();

		return withFiles({
			form,
			result
		});
	},
	edit: async (event) => {
		const form = await superValidate(event, valibot(CreateEventSchema));
		if (!form.valid) {
			return fail(
				400,
				withFiles({
					form
				})
			);
		}

		console.log(form.data);

		if (form.data.image) {
			const imageUrl = await saveFile(
				form.data.image,
				PUBLIC_IMAGE_DIRECTORY,
				convertToSlug(form.data.name)
			);

			form.data.image_url = imageUrl;
		}

		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/events/${form.data.event_id}`,
			{
				method: "PATCH",
				body: JSON.stringify(form.data),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		const result: ApiResponse = await response.json();

		return withFiles({
			form,
			result
		});
	}
};
