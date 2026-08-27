import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

interface User {
	balance: number,
	user: { username: string }
}

export const load: PageServerLoad = async ({ cookies }) => {
	const response = await fetch(`${env.API_HOST}:${env.API_PORT}/admin/overview`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
			'x-refresh-token': cookies.get('x-refresh-token') ?? '',
		}
	});

	const data = await response.json();

	return {
		totalBalance: data.totalBalance as number,
		totalUsers: data.totalUsers as number,
		topEarners: data.topEarners as Array<User>
	}
};