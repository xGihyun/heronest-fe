import type { CreateVenueOutput } from "$lib/map/venue/schema";
import { FormAction } from "$lib/types";

let isOpen = $state(false);
let action = $state(FormAction.Create);
let data: CreateVenueOutput | null = $state(null);

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
		get data(): CreateVenueOutput | null {
			return data;
		},
		set data(value: CreateVenueOutput) {
			data = value;
		},
        reset
	};
}
