import { fail, message, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import type { Actions } from "@sveltejs/kit";
import type { ApiResponse } from "$lib/api/types";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { RegisterSchema } from "$lib/user/schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(valibot(RegisterSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, valibot(RegisterSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/register`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const result: ApiResponse = await response.json();

		console.debug("Register:", result);

		return message(form, result);
	}
};
