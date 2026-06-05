import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async () => {
		await new Promise((resolve) => setTimeout(resolve, 3000));

        return fail(422, {
            error: { message: 'invalid something' }
        });
	}
};
