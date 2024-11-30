import { SeatStatus } from "./types";

export const SEAT_COLOR = {
	[SeatStatus.Available]: "#888888",
	[SeatStatus.Reserved]: "#c5ab72",
    [SeatStatus.Unavailable]: "#5c5c5c",
    hover: "#d6d6d6"
};
