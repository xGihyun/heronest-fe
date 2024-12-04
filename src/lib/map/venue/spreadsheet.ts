import ExcelJS from "exceljs";
import type { Venue } from "./types";

export async function generateVenuesCsv(venues: Venue[]) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Venues");

	const headers = ["Name", "Description", "Location", "Capacity"];

	worksheet.addRow(headers);

	venues.forEach((venue) => {
		const row = [venue.name, venue.description, venue.location, venue.capacity];

		worksheet.addRow(row);
	});

	const csvBuffer = await workbook.csv.writeBuffer();
	const blob = new Blob([csvBuffer], { type: "text/csv" });

	const downloadLink = document.createElement("a");
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = "venues.csv";

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
