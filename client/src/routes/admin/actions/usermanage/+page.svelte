<script lang="ts">
    import CopyButton from "$lib/components/elements/CopyButton.svelte";
    import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Usuários | LemkeBank</title>
</svelte:head>

<div class="flex justify-between items-center mb-3">
	<h1 class="text-2xl lg:text-3xl font-bold">Lista de Usuários</h1>
	<button type="button" class="bg-teal-500 hover:bg-teal-500/90 p-2 rounded font-semibold hover:cursor-pointer transition">+ Criar Usuário</button>
</div>

{#snippet userAdminActions()}
	<button type="button" class="text-blue-500 border rounded py-1 px-2 bg-blue-500/10">Editar</button>
	<button type="button" class="text-yellow-500 border rounded py-1 px-2 bg-yellow-500/10">Mudar Status</button>
{/snippet}
<table class="flex-1">
	<thead>
		<tr>
			<th>Nome de Usuário</th>
			<th>Email</th>
			<th>WalletID</th>
			<th>Status da Conta</th>
			<th>Saldo (BL$)</th>
			<th>Ações</th>
		</tr>
	</thead>
	<tbody>
		{#each data.users as {username, email, walletid, active, balance} (walletid)}
			<tr>
				<td>{username}</td>
				<td>{email}</td>
				<td>{walletid}</td>
				<td class="p-1">
					<div class="active-{active} py-1 px-2 rounded text-center w-fit justify-self-center">
						{active ? 'Ativa' : 'Inativa'}
					</div>
				</td>
				<td>{balance}</td>
				<td>
					<div class="flex h-full items-center justify-center gap-2">
						{@render userAdminActions()}
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	.active-true {
		color: var(--color-green-500);
		background-color: color-mix(in oklab, var(--color-green-500) 10%, transparent);
		border: 1px solid var(--color-green-500);

		@variant dark {
			color: var(--color-green-400);
			background-color: color-mix(in oklab, var(--color-green-400) 10%, transparent);
			border: 1px solid var(--color-green-400);
		}
	}

	.active-false {
		color: var(--color-red-500);
		background-color: color-mix(in oklab, var(--color-red-500) 10%, transparent);
		border: 1px solid var(--color-red-500);

		@variant dark {
			color: var(--color-red-400);
			background-color: color-mix(in oklab, var(--color-red-400) 10%, transparent);
			border: 1px solid var(--color-red-400);
		}
	}
</style>
