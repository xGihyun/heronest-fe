import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as fs from "fs";
import * as path from "path";

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
