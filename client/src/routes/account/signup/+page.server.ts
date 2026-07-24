import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	signup: async ({ request }) => {
		const form = await request.formData();
		const username = form.get('username')?.toString().trim() ?? '';
		const email = form.get('email')?.toString().trim() ?? '';
		const password = form.get('password')?.toString() ?? '';

		if (!username || !email || !password) {
			return fail(422, { error: { message: 'Preencha todos os campos.' } });
		}

		const response = await fetch('http://localhost:3001/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password }),
		});

		const data = await response.json().catch(() => ({}));

		if (!response.ok) {
			return fail(response.status, { error: { message: data.error ?? 'Falha ao cadastrar usuário.' } });
		}

		throw redirect(303, '/account/login');
	}
};
