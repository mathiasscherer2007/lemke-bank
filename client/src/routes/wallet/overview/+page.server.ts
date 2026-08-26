import { env } from "$env/dynamic/private";
import type { PageServerLoad } from "./$types";

interface Entry {
	type: 'credit' | 'debit';
	createdAt: string;
	relatedUser: { username: string };
}

interface Transaction {
	totalAmount: number;
	description?: string;
	createdAt: string;
	entries: Array<Entry>;
}

interface RecentTransaction {
	amount: string | number;
	relatedUser: string;
	type: 'credit' | 'debit';
	date: string;
}

export const load: PageServerLoad = async ({ cookies }) => {
	const response = await fetch(`${env.API_HOST}:${env.API_PORT}/overview`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('x-access-token') ?? ''}`,
			'x-refresh-token': cookies.get('x-refresh-token') ?? ''
		}
	});
	
	const overviewData = await response.json();

	const recentTransactions: Array<RecentTransaction> = [];
	overviewData.recentTransactions.forEach((transaction: Transaction) => {
		recentTransactions.push({
			amount: transaction.totalAmount,
			relatedUser: transaction.entries[0].relatedUser.username,
			type: transaction.entries[0].type,
			date: new Date(transaction.entries[0].createdAt).toLocaleDateString('pt-br')
		})
	});

	return {
		walletDetails: {
			id: overviewData.wallet.id ?? '',
			balance: overviewData.wallet.balance
		},
		recentTransactions: recentTransactions
	}
};