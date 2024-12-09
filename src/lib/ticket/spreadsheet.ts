import ExcelJS from "exceljs";
import { DateFormatter } from "@internationalized/date";
import { formatUserName } from "$lib/user/utils";
import type { Event } from "$lib/map/event/types";
import type { Ticket } from "./types";

export async function generateTicketsCsv(tickets: Ticket[], event?: Event) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Events");

	const headers = [
		"Event",
		"Event Date",
		"Venue",
		"User",
		"Ticket Number",
		"Seat Number",
		"Reservation Date"
	];

	const headerRow = worksheet.addRow(headers);
	headerRow.eachCell((cell) => {
		// NOTE: Doesn't work
		cell.font = { bold: true };
	});

	const df = new DateFormatter("en-US", {
		dateStyle: "short",
        timeStyle: "short"
	});

	tickets.forEach((ticket) => {
		const reservationDate = df.format(new Date(ticket.reserved_at));
		const eventDate = df.formatRange(
			new Date(ticket.reservation.event.start_at),
			new Date(ticket.reservation.event.end_at)
		);
		const row = [
			ticket.reservation.event.name,
			eventDate,
			ticket.reservation.venue.name,
			formatUserName(ticket.reservation.user, "lf"),
			ticket.ticket_number,
			ticket.reservation.seat.seat_number,
			reservationDate
		];

		worksheet.addRow(row);
	});

	const csvBuffer = await workbook.csv.writeBuffer();
	const blob = new Blob([csvBuffer], { type: "text/csv" });

	const downloadLink = document.createElement("a");
	downloadLink.href = URL.createObjectURL(blob);
    const fileName = event ? `${event.name}-reservations.csv` :  "reservations.csv";
	downloadLink.download = fileName;

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
