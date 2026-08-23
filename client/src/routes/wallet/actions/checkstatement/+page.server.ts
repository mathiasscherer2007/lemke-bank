import { env } from "$env/dynamic/private";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const response = await fetch(`${env.API_HOST}:${env.API_PORT}/statement?month=0&year=0`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
			'x-refresh-token': cookies.get('x-refresh-token') ?? '',
		},
	});

	const data = await response.json();

	return { links: data.links ?? '' };
};

export const actions: Actions = {
	getMonthStatement: async ({ request, cookies }) => {
		const formData = await request.formData();
		const endpoint = formData.get('endpoint')?.toString().trim() ?? '';
		const selectedButton = formData.get('monthYear')?.toString().trim() ?? '';

		const response = await fetch(endpoint, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
				'x-refresh-token': cookies.get('x-refresh-token') ?? ''
			}
		})

		const data = await response.json();

		return {
			selectedButton: selectedButton,
			transactions: data.data.entries ?? ''
		}
	}
};