import { UserRole, UserSex } from "$lib/user/types";
import * as v from "valibot";

export const RegisterSchema = v.object({
	user_id: v.optional(v.string()),
	email: v.pipe(v.string(), v.email()),
	password: v.pipe(v.string(), v.nonEmpty("Password is required.")),
	role: v.enum(UserRole),

	first_name: v.pipe(v.string(), v.nonEmpty("First name is required.")),
	middle_name: v.optional(v.string()),
	last_name: v.pipe(v.string(), v.nonEmpty("Last name is required.")),
	birth_date: v.optional(v.date(), () => new Date()),
	sex: v.enum(UserSex)
});

export const CreateUserSchema = v.object({
	user_id: v.optional(v.string()),
	email: v.pipe(v.string(), v.email()),
	password: v.optional(v.string(), "password"),
	role: v.enum(UserRole),

	first_name: v.pipe(v.string(), v.nonEmpty("First name is required.")),
	middle_name: v.nullable(v.string()),
	last_name: v.pipe(v.string(), v.nonEmpty("Last name is required.")),
	birth_date: v.optional(v.date(), () => new Date()),
	sex: v.enum(UserSex)
});

export type RegisterOutput = v.InferOutput<typeof RegisterSchema>;
export type CreateUserOutput = v.InferOutput<typeof CreateUserSchema>;
