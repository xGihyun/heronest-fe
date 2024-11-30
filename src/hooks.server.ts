import { getUser } from "$lib/user/requests";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get("session");

    if(!session) {
        console.warn("Session not found.")
        return await resolve(event)
    }

    const user = await getUser(session)
    event.locals.user = user.data

	const response = await resolve(event);
	return response;
};
