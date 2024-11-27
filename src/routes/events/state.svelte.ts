import type { CreateEventOutput } from "$lib/map/event/schema";
import { FormAction } from "$lib/types";

let isOpen = $state(false);
let action = $state(FormAction.Create);
let data: CreateEventOutput | null = $state(null);

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
		get data(): CreateEventOutput | null {
			return data;
		},
		set data(value: CreateEventOutput) {
			data = value;
		},
        reset
	};
}
