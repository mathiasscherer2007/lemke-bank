import { fail, redirect, type Actions } from '@sveltejs/kit';
import { env } from "$env/dynamic/private";
import { resolve } from '$app/paths';

export const actions: Actions = {
	signup: async ({ request, cookies }) => {
		const form = await request.formData();
		const username = form.get('username')?.toString().trim() ?? '';
		const email = form.get('email')?.toString().trim() ?? '';
		const password = form.get('password')?.toString() ?? '';
		const confirmPassword = form.get('passwordConfirm')?.toString() ?? '';

		if (!username || !email || !password || !confirmPassword) {
			return fail(422, { error: { message: 'Por favor, preencha todos os campos.' } });
		}

		const response = await fetch(`${env.API_HOST}:${env.API_PORT}/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password, confirmPassword }),
		});

		const data = await response.json().catch(() => ({}));

		if (!response.ok) {
			let message: string;

			switch (data.statusCode) {
				case 400:
					message = 'Senha muito curta. Tente uma senha mais forte.';
					break;

				case 422:
					message = 'E-mail já cadastrado a uma conta. Tente realizar login.';
					break;

				default:
					message = 'Algo deu errado. Tente novamente mais tarde.';
					break;
			}

			return fail(response.status, { 'error': { 'message': message } });
		} else {
			cookies.set('x-access-token', response.headers.get('x-access-token') ?? '', { path: '/' });
			cookies.set('x-refresh-token', response.headers.get('x-refresh-token') ?? '', { path: '/' });
			throw redirect(303, resolve('/wallet/overview'));
		}
	}
};
