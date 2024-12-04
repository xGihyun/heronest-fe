import type { RequestHandler } from "./$types";

export const POST: RequestHandler = ({ locals, cookies }) => {
	cookies.delete("session", { path: "/" });

	locals.user = null;

    return new Response()
};