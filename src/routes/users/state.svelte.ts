import { FormAction } from "$lib/types";
import type { CreateUserOutput } from "$lib/user/schema";

let isOpen = $state(false);
let action = $state(FormAction.Create);
let data: CreateUserOutput | null = $state(null);

export function getFormState() {
    function reset() {
        action = FormAction.Create;
        data = null
    }

	return {
		get isOpen() {
			return isOpen;
		},
		set isOpen(value: boolean) {
			isOpen = value;
		},
		get action() {
			return action;
		},
		set action(value: FormAction) {
			action = value;
		},
		get data(): CreateUserOutput | null {
			return data;
		},
		set data(value: CreateUserOutput) {
			data = value;
		},
        reset
	};
}
