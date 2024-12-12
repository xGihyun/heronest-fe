import {
	PUBLIC_AVATAR_DIRECTORY,
	PUBLIC_BACKEND_URL
} from "$env/static/public";
import type { ApiResponse } from "$lib/api/types";
import { formatUserName } from "$lib/user/utils";
import { convertToSlug, saveFile } from "$lib/utils";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
	if (locals.user === null) {
		console.error("User not found.");
		return new Response();
	}

	const blob = await request.blob();

	const fileName = convertToSlug(formatUserName(locals.user));

	const file = new File([blob], fileName, { type: "image/png" });

	const imageUrl = await saveFile(
		file,
		PUBLIC_AVATAR_DIRECTORY,
		`${convertToSlug(formatUserName(locals.user))}.png`
	);

	const response = await fetch(
		`${PUBLIC_BACKEND_URL}/api/users/${locals.user.user_id}/avatar`,
		{
			method: "PATCH",
			body: JSON.stringify({
				user_id: locals.user.user_id,
				avatar_url: imageUrl
			}),
			headers: {
				"Content-Type": "application/json"
			}
		}
	);

	const result: ApiResponse = await response.json();

	console.log(result);

	return new Response(JSON.stringify(result), { status: result.status_code });
};
