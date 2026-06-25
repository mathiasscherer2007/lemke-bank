import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    pay: async ({ request }) => {
        // Simulate server delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        console.log(await request.formData());

        return;
    }
};