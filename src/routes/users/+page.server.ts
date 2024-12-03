import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { valibot } from "sveltekit-superforms/adapters";
import { CreateUserSchema } from "$lib/user/schema";
import type { Actions } from "@sveltejs/kit";
import { getUsers } from "$lib/user/requests";

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";
	const name = url.searchParams.get("name") || undefined;

	const users = await getUsers({ page, limit, name });

	return {
		venues: users.data,
		form: await superValidate(valibot(CreateUserSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, valibot(CreateUserSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/users`, {
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
		const form = await superValidate(event, valibot(CreateUserSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const response = await fetch(
			`${PUBLIC_BACKEND_URL}/api/users/${form.data.user_id}`,
			{
				method: "PATCH",
				body: JSON.stringify(form.data),
				headers: {
					"Content-Type": "application/json"
				}
			}
		);

		const result: ApiResponse = await response.json();

		return {
			form,
			result
		};
	}
};
