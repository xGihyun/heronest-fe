import { fail, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { registerSchema } from "./schema";
import type { Actions } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(valibot(registerSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, valibot(registerSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    return {
      form
    };
  }
};
