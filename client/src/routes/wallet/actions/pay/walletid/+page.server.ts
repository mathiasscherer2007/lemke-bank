import { resolve } from '$app/paths';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  pay: async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await request.formData();

    if (!data.get('amount')) {
      return fail(422, {
        error: { message: 'Há campos faltantes no pagamento enviado.' }
      });
    }
    if (!data.get('reciever')) {
      return fail(422, {
        error: { message: 'Há campos faltantes no pagamento enviado.' }
      });
    }

    if (true === true) {
      throw redirect(308, resolve('/wallet/actions/pay/confirmations/success'));
    } else {
        throw redirect(308, resolve('/wallet/actions/pay/confirmations/failure'));
    }
  }
};
