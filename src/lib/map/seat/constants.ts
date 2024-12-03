import type { SelectOption } from "$lib/types";
import { SeatStatus } from "./types";

export const SEAT_COLOR = {
	[SeatStatus.Available]: "#888888",
	[SeatStatus.Reserved]: "#c5ab72",
	[SeatStatus.Unavailable]: "#5c5c5c",
	reserved_current_user: "#f8bd3f",
	hover: "#d6d6d6"
};

export const SEAT_STATUS_OPTIONS: SelectOption[] = [
	{
		value: SeatStatus.Available,
		label: "Available"
	},
	{
		value: SeatStatus.Unavailable,
		label: "Unavailable"
	},
	{
		value: SeatStatus.Reserved,
		label: "Reserved"
	}
];
