import { UserRole, UserSex } from "$lib/users/types";
import * as v from "valibot";

export const registerSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.nonEmpty("Password is required.")),
  role: v.enum(UserRole),

  first_name: v.pipe(v.string(), v.nonEmpty("First name is required.")),
  middle_name: v.optional(v.string()),
  last_name: v.pipe(v.string(), v.nonEmpty("Last name is required.")),
  //birth_date: v.string(),
  birth_date: v.pipe(v.date(), v.toMinValue(new Date())),
  sex: v.enum(UserSex)
});

export type RegisterSchema = typeof registerSchema
