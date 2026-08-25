import { env } from '$env/dynamic/private';
import { redirect, type Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const pathName = event.url.pathname;

	if (pathName.startsWith('/wallet') || pathName.startsWith('/admin') || pathName.startsWith('/shared')) {
		const accessToken = event.cookies.get('x-access-token');
		const refreshToken = event.cookies.get('x-refresh-token');
		if (accessToken && refreshToken) {
			let payload;
			try {
				payload = jwt.verify(accessToken, env.API_SECRET);
			} catch {
				event.cookies.delete('x-access-token', { path: '/' });
				event.cookies.delete('x-refresh-token', { path: '/' });
				throw redirect(303, `/account/login`);
			}

			if (typeof payload === 'object') {
				const role = payload.role ?? '';

				switch (role) {
					case 'user':
						if (pathName.startsWith('/admin')) {
							throw redirect(303, '/wallet/overview');
						}
						break;
				
					default:
						break;
				}
			}
			
		} else {
			throw redirect(303, `/account/login`);
		}
	}

	const response = await resolve(event);
	return response;
}