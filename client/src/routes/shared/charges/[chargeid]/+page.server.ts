import { env } from "$env/dynamic/private";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { resolve } from "$app/paths";

export const load: PageServerLoad = async ({ params, cookies }) => {
	const response = await fetch(`${env.API_HOST}:${env.API_PORT}/charges/${params.chargeid}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
			'x-refresh-token': cookies.get('x-refresh-token') ?? '',
		}
	});

	const data = await response.json();

	return {
		'charge': data.charge,
		'isIssuer': data.isIssuerWallet
	}
};

export const actions: Actions = {
	pay: async ({ request, cookies }) => {
		const chargeId = (await request.formData()).get('chargeId') ?? '';
		const response = await fetch(`${env.API_HOST}:${env.API_PORT}/charges/pay/${chargeId}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
				'x-refresh-token': cookies.get('x-refresh-token') ?? ''
			}
		});

		console.log(await response.json());
		if (response.ok) {
			throw redirect(303, resolve('/shared/charges/confirmations/success'));
		}
	}
};