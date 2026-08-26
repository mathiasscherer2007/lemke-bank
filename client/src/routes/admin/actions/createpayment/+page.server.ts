import { env } from "$env/dynamic/private";
import * as publicEnv from "$env/dynamic/public";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	createpayment: async ({ request, cookies }) => {
		const data = await request.formData();
		const amount = Number(data.get('amount') ?? 0);
		const description = data.get('description') ?? '';

		if (!amount || amount <= 0) {
			return fail(422, 'Quantidade não definida ou inválida.')
		}

		const response = await fetch(`${env.API_HOST}:${env.API_PORT}/charges`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
				'x-refresh-token': cookies.get('x-refresh-token') ?? '',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				amount: amount,
				description: description
			})
		})

		if (response.ok) {
			const chargeData = await response.json();

			const link = `${publicEnv.env.PUBLIC_APP_URL}shared/charges/${chargeData.charge?.id ?? ''}`;
			throw redirect(303, `/admin/actions/createpayment/viewlink?link=${link}`)
		} else {
			// ?
		}
	}
};