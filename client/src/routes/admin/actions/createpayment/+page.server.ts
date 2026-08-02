import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	createpayment: async ({ request }) => {
		const data = await request.formData();

		// Simulate delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const link = `lemkebank.test.com/${data.get("amount")}${data.get("description")}`;
		throw redirect(303, `/admin/actions/createpayment/viewlink?link=${link}`)
	}
};