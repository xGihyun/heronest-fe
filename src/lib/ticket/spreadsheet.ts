import ExcelJS from "exceljs";
import { DateFormatter } from "@internationalized/date";
import type { GetTicketResponse } from "./types";
import { formatUserName } from "$lib/user/utils";

export async function generateTicketsCsv(tickets: GetTicketResponse[]) {
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
		dateStyle: "short"
	});

	tickets.forEach((ticket) => {
		const reservationDate = df.format(new Date(ticket.created_at));
		const eventDate = df.formatRange(
			new Date(ticket.event.start_at),
			new Date(ticket.event.end_at)
		);
		const row = [
			ticket.event.name,
			eventDate,
			ticket.venue.name,
			formatUserName(ticket.user, "lf"),
			ticket.ticket_number,
			ticket.seat.seat_number,
			reservationDate
		];

		worksheet.addRow(row);
	});

	const csvBuffer = await workbook.csv.writeBuffer();
	const blob = new Blob([csvBuffer], { type: "text/csv" });

	const downloadLink = document.createElement("a");
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = "reservations.csv";

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
