import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as fs from "fs";
import * as path from "path";
import { DateFormatter } from "@internationalized/date";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function saveFile(
	file: File,
	targetDir: string,
	name: string
): Promise<string> {
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	const fileExtension = path.extname(file.name);
	const fileName = `${name}${fileExtension}`;
	const filePath = path.join(targetDir, fileName);

	const bytes = await file.bytes();

	await fs.promises.writeFile(filePath, bytes);

	return fileName;
}

export function convertToSlug(str: string) {
	return str.trim().toLowerCase().replace(/\s+/g, "_");
}

// TODO: Merge this with `formatTimeRangeClean`
export function formatDateRangeClean(
	start: Date,
	end: Date,
	locale = "en-US"
): string {
	const df = new DateFormatter(locale, { dateStyle: "long" });
	return df
		.formatRange(start, end)
		.replace(/–/g, "-")
		.replace(/\u2013/g, "-")
		.replace(/\u2009/g, " ")
		.replace(/\u202f/g, " ");
}

export function formatTimeRangeClean(
	start: Date,
	end: Date,
	locale = "en-US"
): string {
	const timeFormatter = new DateFormatter(locale, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true
	});
	return timeFormatter
		.formatRange(start, end)
		.replace(/–/g, "-")
		.replace(/\u2013/g, "-")
		.replace(/\u2009/g, " ")
		.replace(/\u202f/g, " ");
}

export function downloadFile(blob: Blob, fileName: string) {
	const downloadLink = document.createElement("a");
	downloadLink.href = URL.createObjectURL(blob);
	downloadLink.download = fileName;

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}

export async function downloadFileFromUrl(fileUrl: string, fileName: string) {
	const response = await fetch(fileUrl);
	const blob = await response.blob();

	downloadFile(blob, fileName);
}
