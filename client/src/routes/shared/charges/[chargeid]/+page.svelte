<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<title>Realizar Pagamento | LemkeBank</title>
</svelte:head>

<div class="flex-1 flex items-center justify-center">
	<form method="POST" action="?/pay" class="flex h-full w-full flex-col justify-end overflow-x-hidden lg:h-auto lg:w-1/2 lg:rounded-lg lg:bg-[#00000020] lg:p-5" use:enhance={() => {
		submitting = true;

		return async ({ update }) => {
			submitting = false;
			await update();
		}
	}}>
		<h1 class="mb-4 font-[Stack_Sans_Headline] text-3xl">Realizar Pagamento</h1>
		<p class="text-lg my-1">Valor: {data.charge.amount}</p>
		<p class="text-lg my-1">Descrição: {data.charge.description ?? 'Nenhuma descrição fornecida.'}</p>
		<p class="text-lg my-1">Criado em: {new Date(data.charge.createdAt).toLocaleString('pt-br')}</p>
		<input type="hidden" name="chargeId" value={data.charge.id}>
		<span class="mt-5">
			{#if !data.isIssuer}
				<button disabled={submitting} type="submit" class="w-full rounded-lg border p-3 text-lg font-semibold transition enabled:cursor-pointer disabled:cursor-default disabled:bg-transparent disabled:text-teal-400 enabled:border-teal-500 enabled:bg-teal-500 enabled:hover:bg-teal-500/80 text-center">{submitting ? '...' : 'Pagar'}</button>
			{:else}
				<p class="rounded-lg border p-3 text-lg font-semibold transition enabled:cursor-pointer disabled:cursor-default disabled:bg-transparent disabled:text-teal-400 enabled:border-teal-500 enabled:bg-teal-500 enabled:hover:bg-teal-500/80 text-center">Você não pode pagar seu próprio link.</p>
			{/if}
		</span>
	</form>
</div>