import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pathName = event.url.pathname;

	if (pathName.startsWith('/wallet') || pathName.startsWith('/admin') || pathName.startsWith('/shared')) {
		if (event.cookies.get('x-access-token') && event.cookies.get('x-refresh-token')) {
			// pass
		} else {
			throw redirect(303, `/account/login?redirectTo=${pathName}`);
		}
	}

	const response = await resolve(event);
	return response;
}