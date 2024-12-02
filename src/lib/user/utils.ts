import type { User } from "./types";

export function formatUserName(user: User): string {
    return `${user.first_name} ${user.last_name}`
}
