import { ApiResponseStatus } from "$lib/api/types";
import { getUser } from "$lib/user/requests";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get("session");

    if(!session && !event.route.id?.startsWith("/(auth)")) {
        throw redirect(302, "/login")
    }

    if(!session) {
        console.warn("Session not found.")
        return await resolve(event)
    }

    const user = await getUser(session)

    if(user.status !== ApiResponseStatus.Success) {
        console.error(user.message)
        return await resolve(event)
    }

    event.locals.user = user.data

	const response = await resolve(event);
	return response;
};
