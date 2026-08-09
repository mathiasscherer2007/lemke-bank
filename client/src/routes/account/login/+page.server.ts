import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	login: async ({ request }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString().trim() ?? '';
		const password = form.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(422, { error: { message: 'Preencha todos os campos.' } });
		}

		const response = await fetch('http://localhost:3001/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json().catch(() => ({}));

		if (!response.ok) {
			return fail(response.status, { error: { message: data.error ?? 'falha ao logar' } });
		}
	}
};
