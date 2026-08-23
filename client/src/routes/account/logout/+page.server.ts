import { env } from "$env/dynamic/private";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { resolve } from "$app/paths";

export const actions: Actions = {
	logout: async ({ cookies, fetch }) => {
		const response = await fetch(`${env.API_HOST}:${env.API_PORT}/logout`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
				'x-refresh-token': cookies.get('x-refresh-token') ?? '',
			}
		});

		if (!response.ok) {
			return fail(response.status);
		} else {
			cookies.delete('x-access-token', { path: '/' });
			cookies.delete('x-refresh-token', { path: '/' });
		}

		throw redirect(303, resolve('/account/login'));
	},
};