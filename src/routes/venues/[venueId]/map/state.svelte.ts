import { SLIDER_SCALE } from "$lib/map/constants";
import type { Seat } from "$lib/map/seat/types";
import { Rect } from "konva/lib/shapes/Rect";

export const selectedSeat = $state<{ seat: Seat | null; rect: Rect | null }>({
	seat: null,
	rect: null
});

type MapState = {
	scale: number;
	seats: Seat[];
};

export const mapState = $state<MapState>({
	scale: SLIDER_SCALE.initial,
	seats: []
});
