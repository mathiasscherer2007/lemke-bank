import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
	const response = await fetch(`${env.API_HOST}:${env.API_PORT}/overview`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
			'x-refresh-token': cookies.get('x-refresh-token') ?? '',
		}
	});

	console.log(await response.json());
};