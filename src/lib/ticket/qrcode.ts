import { PDFDocument, rgb, RotationTypes, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import * as fs from "fs";
import * as path from "path";
import type { Ticket } from "./types";
import { formatUserName } from "$lib/user/utils";
import { formatDateRangeClean, formatTimeRangeClean } from "$lib/utils";

export async function generateTicketPdf(
	templatePath: string,
	outputPath: string,
	ticket: Ticket,
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
): Promise<void> {
	const templateBytes = await fetch(templatePath).then((res) =>
		res.arrayBuffer()
	);

	const pdfDoc = await PDFDocument.load(templateBytes);
	const page = pdfDoc.getPage(0);
	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

	const pdfWidth = page.getWidth();
	const pdfHeight = page.getHeight();

	const darkBlueRgb = rgb(0.11, 0.13, 0.34);
	const yellowRgb = rgb(1, 0.97, 0.34);

	// The details on the right side
	page.drawText(formatUserName(ticket.reservation.user), {
		x: pdfWidth - 58,
		y: 48,
		size: 8,
		font: font,
		color: darkBlueRgb,
		rotate: { angle: 90, type: RotationTypes.Degrees }
	});

	page.drawText(ticket.ticket_number, {
		x: pdfWidth - 58 + 10,
		y: 60,
		size: 8,
		font: font,
		color: darkBlueRgb,
		rotate: { angle: 90, type: RotationTypes.Degrees }
	});

	page.drawText(ticket.reservation.seat.seat_number, {
		x: pdfWidth - 58 + 22,
		y: 52,
		size: 8,
		font: font,
		color: darkBlueRgb,
		rotate: { angle: 90, type: RotationTypes.Degrees }
	});

	page.drawText(ticket.reservation.event.name, {
		x: pdfWidth - 58 + 34,
		y: 52,
		size: 8,
		font: font,
		color: darkBlueRgb,
		rotate: { angle: 90, type: RotationTypes.Degrees }
	});

	page.drawText(ticket.reservation.venue.name, {
		x: pdfWidth - 58 + 46,
		y: 52,
		size: 8,
		font: font,
		color: darkBlueRgb,
		rotate: { angle: 90, type: RotationTypes.Degrees }
	});

	// The main details
	page.drawText(ticket.reservation.event.name, {
		x: pdfWidth / 2 - 140,
		y: pdfHeight / 2 + 28,
		size: 20,
		font: boldFont,
		color: darkBlueRgb
	});

	const venueNameWidth = font.widthOfTextAtSize(ticket.reservation.venue.name, 12);

	page.drawText(ticket.reservation.venue.name, {
		x: pdfWidth - 110 - venueNameWidth,
		y: 24,
		size: 12,
		font: font,
		color: yellowRgb
	});

	const ticketNumberWidth = boldFont.widthOfTextAtSize(
		ticket.ticket_number,
		16
	);

	page.drawText(ticket.ticket_number, {
		x: pdfWidth - 110 - ticketNumberWidth,
		y: pdfHeight - 38,
		size: 16,
		font: boldFont,
		color: yellowRgb
	});

	const namePosition = { x: 195, y: 90 };

	page.drawText(`${formatUserName(ticket.reservation.user)}`, {
		x: namePosition.x,
		y: namePosition.y,
		size: 12,
		font,
		color: rgb(1, 1, 1)
	});
	page.drawText(ticket.reservation.seat.seat_number, {
		x: namePosition.x,
		y: namePosition.y - 17,
		size: 12,
		font,
		color: rgb(1, 1, 1)
	});

	const eventDate = formatDateRangeClean(
		new Date(ticket.reservation.event.start_at),
		new Date(ticket.reservation.event.end_at)
	);

	page.drawText(eventDate, {
		x: namePosition.x,
		y: namePosition.y - 17 * 2,
		size: 12,
		font,
		color: rgb(1, 1, 1)
	});

	const eventTime = formatTimeRangeClean(
		new Date(ticket.reservation.event.start_at),
		new Date(ticket.reservation.event.end_at)
	);

	page.drawText(eventTime, {
		x: namePosition.x,
		y: namePosition.y - 17 * 3,
		size: 12,
		font,
		color: rgb(1, 1, 1)
	});

	const qrDataURL = await QRCode.toDataURL(ticket.ticket_number, {
		color: { dark: "#ffffffff", light: "#00000000" }
	});
	const qrImageBytes = await fetch(qrDataURL).then((res) => res.arrayBuffer());
	const qrImage = await pdfDoc.embedPng(qrImageBytes);

	const qrWidth = 100;
	const qrHeight = 100;
	const qrPosition = { x: 8, y: 16 };

	page.drawImage(qrImage, {
		x: qrPosition.x,
		y: qrPosition.y,
		width: qrWidth,
		height: qrHeight
	});

	const modifiedPdfBytes = await pdfDoc.save();

	if (!fs.existsSync(outputPath)) {
		fs.mkdirSync(outputPath, { recursive: true });
	}

	const fileName = `Ticket-${ticket.ticket_number}.pdf`;
	const filePath = path.join(outputPath, fileName);
	await fs.promises.writeFile(filePath, modifiedPdfBytes);
}
