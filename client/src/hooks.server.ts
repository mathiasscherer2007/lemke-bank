import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pathName = event.url.pathname;

	if (pathName.startsWith('/wallet') || pathName.startsWith('/admin')) {
		if (event.cookies.get('x-access-token') && event.cookies.get('x-refresh-token')) {
			const response = await resolve(event);
			return response;
		} else {
			throw redirect(303, '/account/login');
		}
	}

	const response = await resolve(event);
	return response;
}