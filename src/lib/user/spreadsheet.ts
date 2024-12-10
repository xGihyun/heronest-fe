import ExcelJS from "exceljs";
import type { User } from "./types";
import { DateFormatter } from "@internationalized/date";
import { downloadFile } from "$lib/utils";
import { format } from "date-fns";

export async function generateUsersCsv(users: User[]) {
	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Users");

	const headers = [
		"Last Name",
		"First Name",
		"Middle Name",
		"Email",
		"Gender",
		"Birth Date",
		"Role"
	];

	worksheet.addRow(headers);

	const df = new DateFormatter("en-US", {
		dateStyle: "short"
	});

	users.forEach((user) => {
		const birthDate = df.format(new Date(user.birth_date));
		const row = [
			user.last_name,
			user.first_name,
			user.middle_name,
			user.email,
			user.sex,
			birthDate,
			user.role
		];

		worksheet.addRow(row);
	});

	const csvBuffer = await workbook.csv.writeBuffer();
	const blob = new Blob([csvBuffer], { type: "text/csv" });
	const currentDate = format(new Date(), "yyyy-MM-dd - hh:mma");

	downloadFile(blob, `Users - ${currentDate}.csv`);
}
