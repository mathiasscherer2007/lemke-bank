import { resolve } from '$app/paths';
import { env } from '$env/dynamic/private';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  pay: async ({ request, cookies }) => {
    const formData = await request.formData();

    const fullData = JSON.parse(formData.get('fullData')?.toString() ?? '{}');

    const receiver = fullData.receiver.toString().trim() ?? '';
    const amount = fullData.amount.toString() ?? 0;
    const description = fullData.description ?? '';

    if (!receiver || !amount) {
      throw redirect(303, resolve('/wallet/actions/pay/confirmations/failure'));
    }

    const response = await fetch(`${env.API_HOST}:${env.API_PORT}/transactions`, {
      method: 'POST',
      headers: {
        'x-refresh-token': cookies.get('x-refresh-token') ?? '',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
      },
      body: JSON.stringify({
        toWalletId: receiver,
        amount: amount,
        description: description,
      })
    });

    // TEMPORARY
    // When backend is implemented, this will check if the request returned OK or not
    if (response.ok) {
      throw redirect(303, resolve('/wallet/actions/pay/confirmations/success'));
    } else {
      let message;
      switch (response.status) {
        case 422:
          message = "Transações só podem ser feitas em dias úteis.";
          break;
      
        default:
          break;
      }

      throw redirect(303, resolve(`/wallet/actions/pay/confirmations/failure?message=${message}`));
    }
  }
};
