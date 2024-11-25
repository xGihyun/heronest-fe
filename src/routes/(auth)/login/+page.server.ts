import { fail, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { redirect, type Actions } from "@sveltejs/kit";
import { BACKEND_URL } from "$env/static/private";
import type { ApiResponse } from "$lib/api/types";
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

		const response = await fetch(`${BACKEND_URL}/api/login`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const result: ApiResponse<User> = await response.json();

		event.cookies.set("session", result.data.user_id, {
			path: "/",
			sameSite: "none",
			secure: true
		});

		redirect(302, "/");
	}
};
