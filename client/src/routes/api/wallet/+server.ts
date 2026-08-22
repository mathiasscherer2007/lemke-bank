import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies }) => {
	const response = await fetch(`${env.API_HOST}:${env.API_PORT}/wallets/${url.searchParams.get('walletId') ?? ''}`, {
		method: 'GET',
		headers: {
			'x-access-token': cookies.get('x-access-token') ?? '',
			'x-refresh-token': cookies.get('x-refresh-token') ?? '',
		}
	});

	const body = await response.json();

	return new Response(JSON.stringify(body));
}