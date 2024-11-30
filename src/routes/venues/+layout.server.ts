import { getVenues } from "$lib/map/venue/requests";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ url }) => {
	const page = url.searchParams.get("page") || "1";
	const limit = url.searchParams.get("limit") || "10";

	const venues = await getVenues({ limit, page });

	return {
		venues: venues.data
	};
};
