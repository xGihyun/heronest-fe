import { getUser } from "$lib/user/requests";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const user = await getUser(params.userId);

	return {
		userInPage: user.data
	};
};
