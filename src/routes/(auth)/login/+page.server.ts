import { fail, message, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { type Actions } from "@sveltejs/kit";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { ApiResponseStatus, type ApiResponse } from "$lib/api/types";
import type { User } from "$lib/user/types";
import { LoginSchema } from "./schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(valibot(LoginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, valibot(LoginSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/login`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const result: ApiResponse<User> = await response.json();

		console.debug("Login:", result);

		if (result.status !== ApiResponseStatus.Success) {
			return message(form, result);
		}

		event.cookies.set("session", result.data.user_id, {
			path: "/",
			sameSite: "none",
			secure: true
		});

		event.locals.user = result.data;
		event.locals.session = result.data.user_id;

		return message(form, result);
	}
};
