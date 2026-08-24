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
		'issuer': data.issuer,
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
		
		if (response.ok) {
			throw redirect(303, resolve('/shared/charges/confirmations/success'));
		} else {
			const data = await response.json();
			let message;
			switch (response.status) {
				case 422:
					switch (data.code) {
						case 'NOT_BUSINESS_DAY':
							message = 'Transações só podem ser realizadas em dias úteis.';
							break;
					
						case 'INSUFFICIENT_FUNDS':
							message = 'Você não tem fundos suficientes para realizar este pagamento.';
							break;
						default:
							break;
					}
					break;

				default:
				break;
			}
			throw redirect(303, resolve(`/wallet/actions/pay/confirmations/failure?message=${message}`));
		}
	}
};