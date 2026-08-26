import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, cookies }) => {
	const rawLink = url.searchParams.get('link');
	if (!rawLink) { redirect(303, '/admin'); }

	const paymentLink = rawLink.replace(/[^a-zA-Z0-9_-]/g, '_');
	let expiration = cookies.get(paymentLink);

    if (!expiration) {
        expiration = (Date.now() + 30 * 60 * 1000).toString();
        cookies.set(paymentLink, expiration, { 
            path: '/', 
            maxAge: 300 
        });
    }

    return {
        timeRemaining: expiration
    };
};