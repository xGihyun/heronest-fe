import ExcelJS from "exceljs";
import type { Event } from "./types";
import { DateFormatter } from "@internationalized/date";

export async function generateEventCsv(events: Event[]) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Events");

	const headers = ["Event", "Date", "Venue"];

	worksheet.addRow(headers);

	const df = new DateFormatter("en-US", {
		dateStyle: "short"
	});

	events.forEach((event) => {
		const eventDate = df.formatRange(
			new Date(event.start_at),
			new Date(event.end_at)
		);
		const row = [event.name, eventDate, event.venue.name];

		worksheet.addRow(row);
	});

    const csvBuffer = await workbook.csv.writeBuffer()
    const blob = new Blob([csvBuffer], {type: 'text/csv'})

    const downloadLink= document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = "events.csv"

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}
