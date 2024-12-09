import { getContext, setContext } from 'svelte';
import type { User } from './types';

const USER_KEY = Symbol('user');

export function setUserContext(user: User) {
	setContext(USER_KEY, user);
}

export function getUserContext(): User {
	return getContext(USER_KEY) as User;
}
