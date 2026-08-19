import { env } from "$env/dynamic/private";
import { monthToNumber } from "$lib/utils/date-utils";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies, url }) => {
	const month = monthToNumber(url.searchParams.get('month') ?? '');
	const year = Number(url.searchParams.get('year') ?? 0);

	if (!month || !year) {
		error(400, 'Month or year were not set.');
	}

	return fetch(`${env.PRIVATE_API_URL}statement?month=${month}&year=${year}`, {
		method: 'GET',
		headers: {
			'x-access-token': cookies.get('x-access-token') ?? '',
			'x-refresh-token': cookies.get('x-refresh-token') ?? '',
		}
	});
}