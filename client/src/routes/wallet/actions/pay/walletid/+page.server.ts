import { resolve } from '$app/paths';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  pay: async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await request.formData();
    let fullData;

    if (typeof data.get('fullData') === 'string') {
      fullData = JSON.parse(data.get('fullData') as string ?? '');
    }

    console.log(fullData)

    if (!fullData.receiver || !fullData.amount) {
      throw redirect(303, resolve('/wallet/actions/pay/confirmations/failure'));
    }

    // TEMPORARY
    // When backend is implemented, this will check if the request returned OK or not
    if (true === true) {
      throw redirect(303, resolve('/wallet/actions/pay/confirmations/success'));
    } else {
      throw redirect(303, resolve('/wallet/actions/pay/confirmations/failure'));
    }
  }
};
