import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, cookies }) => {
	const response = await fetch(`${env.API_HOST}:${env.API_PORT}/users/search?query=${url.searchParams.get('query')}&limit=5`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
			'x-refresh-token': cookies.get('x-refresh-token') ?? '',
		}
	});

	if (response.ok) {
		const body = await response.json();
		return new Response(JSON.stringify(body), {status: 200, headers: {'Content-Type': 'application/json'}});
	} else {
		return new Response(
			JSON.stringify({ message: "Pesquisa não retornou nada."}), {
				status: 404,
				headers: {
					'Content-Type': 'application/json',
				}
			}
		)
	}
}