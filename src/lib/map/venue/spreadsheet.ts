import ExcelJS from "exceljs";
import type { Venue } from "./types";
import { downloadFile } from "$lib/utils";
import { format } from "date-fns";

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
    const currentDate = format(new Date(), "yyyy-MM-dd - hh:mma")
    const fileName = `Venues - ${currentDate}.csv`

    downloadFile(blob, fileName)
}
