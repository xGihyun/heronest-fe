import { getContext, setContext } from 'svelte';
import type { User } from './types';

const userKey = Symbol('user');

export function setUserContext(user: User) {
	setContext(userKey, user);
}

export function getUserContext(): User {
	return getContext(userKey) as User;
}
