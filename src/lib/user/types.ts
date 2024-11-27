export enum UserRole {
	Admin = "admin",
	Staff = "staff",
	Student = "student",
	Visitor = "visitor"
}

export enum UserSex {
	Male = "male",
	Female = "female"
}

export type User = {
	user_id: string;
	email: string;
	role: UserRole;
	first_name: string;
	middle_name?: string;
	last_name: string;
	birth_date: Date;
	sex: UserSex;
};
