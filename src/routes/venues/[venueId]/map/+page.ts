import type { PageLoad } from "./$types";

export const csr = true;
export const ssr = false;

export const load: PageLoad = async ({ params, data }) => {
	return {
		seats: data.seats,
		venueId: params.venueId,
        events: data.events,
        users: data.users,
        form: data.form
	};
};
