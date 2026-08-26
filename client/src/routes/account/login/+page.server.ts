import { fail, redirect, type Actions } from '@sveltejs/kit';
import { env } from "$env/dynamic/private";
import { resolve } from '$app/paths';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString().trim() ?? '';
		const password = form.get('password')?.toString() ?? '';

		if (!email || !password) {
			return fail(422, { error: { message: 'Por favor, preencha todos os campos.' } });
		}

		const response = await fetch(`${env.API_HOST}:${env.API_PORT}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		const data = await response.json().catch(() => ({}));

		if (!response.ok) {
			let message: string;

			switch (data.statusCode) {
				case 400 | 401:
					message = 'E-mail ou senha inválidos. Tente novamente.';
					break;

				case 404:
					message = 'E-mail não cadastrado. Tente criar uma conta.';
					break;

				default:
					message = 'Algo deu errado. Tente novamente mais tarde.';
					break;
			}

			return fail(response.status, { 'error': { 'message': message } });
		} else {
			cookies.set('x-access-token', response.headers.get('x-access-token') ?? '', { path: '/' });
			cookies.set('x-refresh-token', response.headers.get('x-refresh-token') ?? '', { path: '/' });

			if (data.role === 'user') {
				throw redirect(303, resolve('/wallet/overview'));
			} else if (data.role === 'admin') {
				throw redirect(303, resolve('/admin'));
			}
		}
	}
};
