import type { Seat } from "$lib/map/seat/types";
import { Rect } from "konva/lib/shapes/Rect";

export const selectedSeat = $state<{ seat: Seat | null; rect: Rect | null }>({
	seat: null,
	rect: null
});
