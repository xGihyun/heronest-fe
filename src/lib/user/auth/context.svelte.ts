import { getContext, setContext } from "svelte";
import type { User } from "../types";

const AUTH_KEY = Symbol("auth");

type AuthContext = {
	user: User | null;
    session: string | null;
};

let authState = $state<AuthContext>({
	user: null,
    session: null
});

export function setAuthContext(context: AuthContext) {
    authState = context
	setContext(AUTH_KEY, authState);
}

export function getAuthContext(): AuthContext {
	return getContext<AuthContext>(AUTH_KEY);
}
