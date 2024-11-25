import { fail, superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { RegisterSchema } from "./schema";
import type { Actions } from "@sveltejs/kit";
import { BACKEND_URL } from "$env/static/private";
import type { ApiResponse } from "$lib/api/types";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(valibot(RegisterSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, valibot(RegisterSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const response = await fetch(`${BACKEND_URL}/api/register`, {
      method: "POST",
      body: JSON.stringify(form.data),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const result: ApiResponse = await response.json()

    return {
      form,
      result
    };
  }
};
