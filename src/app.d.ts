import type { User } from '$lib/user/types';
import 'unplugin-icons/types/svelte'

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		 interface Locals {
            user: User | null
        }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
