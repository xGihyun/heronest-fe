import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import { valibot } from "sveltekit-superforms/adapters";
import { CreateUserSchema } from "$lib/user/schema";
import type { Actions } from "@sveltejs/kit";
import type { User } from "$lib/user/types";

export const load: PageServerLoad = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";

	const response = await fetch(
		`${PUBLIC_BACKEND_URL}/api/users?page=${page}&limit=${limit}`,
		{
			method: "GET"
		}
	);
	const result: ApiResponse<User[]> = await response.json();

    console.log("page.server.ts:", result)

	return {
		venues: result.data,
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

        console.log(form.data)

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/users`, {
			method: "POST",
			body: JSON.stringify(form.data),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const result: ApiResponse = await response.json();

        console.log("Created user:", result)

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

		const response = await fetch(`${PUBLIC_BACKEND_URL}/api/users/${form.data.user_id}`, {
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
