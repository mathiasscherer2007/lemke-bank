<script lang="ts">
  import type { PageProps } from './$types';

  import arrowinIcon from '$lib/assets/icons/arrow-in.svg';
  import arrowoutIcon from '$lib/assets/icons/arrow-out.svg';
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';

  import CopyButton from '$lib/components/elements/CopyButton.svelte';
  import NavLink from '$lib/components/elements/NavLink.svelte';
  import NavLinkContainer from '$lib/components/elements/NavLinkContainer.svelte';

  let { data }: PageProps = $props();

  const links = [
    {title: 'Realizar Pagamento', icon: payIcon, link: '/wallet/actions/pay'},
    {title: 'Verificar Extrato', icon: statementIcon, link: '/wallet/actions/checkstatement'},
    {title: 'Criar Pagamento', icon: createPayment, link: '/wallet/actions/createpayment'}
  ] as const;

  let idElement: HTMLElement | undefined = $state();
</script>

<svelte:head>
  <title>Carteira | LemkeBank</title>
</svelte:head>

<div>
  <div class="flex w-full justify-between">
    <p class="text-xl">Saldo atual</p>
    <span class="hidden lg:flex items-center gap-2">
      <span class="text-lg"><b>WalletID:</b> <span bind:this={idElement}>{data.walletDetails.id}</span></span>
      <span class="h-5 aspect-square my-auto">
        <CopyButton elementToCopy={idElement} tooltipPosition='bottom' tooltipText='Copiar ID' />
      </span>
    </span>
  </div>
  <p class="lg:pl-2 text-2xl lg:text-3xl font-bold">BL$ {data.walletDetails.balance}</p>
  
</div>
<NavLinkContainer columns="3">
  {#each links as { title, icon, link } (link)}
    <NavLink title={title} icon={icon} {link} />
  {/each}
</NavLinkContainer>
<span class="flex lg:hidden items-center justify-between gap-2 mt-5">
    <span class="text-lg max-w-4/5 whitespace-nowrap text-ellipsis overflow-x-clip"><b>WalletID:</b> <span bind:this={idElement}>{data.walletDetails.id}</span></span>
    <span class="h-7 aspect-square my-auto">
      <CopyButton elementToCopy={idElement} tooltipPosition='bottom' tooltipText='Copiar ID' />
    </span>
</span>

<hr class="my-4 lg:my-6 border-neutral-500" />

{#snippet transaction(type: 'credit' | 'debit', relatedUser: string, date: string, amount: string | number)}
  <li class="-mt-px flex justify-between py-2 text-lg">
    <span class="flex items-center gap-2">
      <figure
        class="h-7 w-7 p-1 {type === 'credit' ? 'green-filter' : 'red-filter'}"
      >
        <img src={type === 'credit' ? arrowinIcon : arrowoutIcon} alt={type} />
      </figure>
      <p>{relatedUser}</p>
      <p class="text-neutral-500 dark:text-neutral-400">| {date}</p>
    </span>
    <p class="{type}">{type === 'debit' ? '-' : ''}BL$ {amount}</p>
  </li>
{/snippet}

<div class="flex flex-col">
  <p class="mb-3 text-xl lg:text-2xl">Transações recentes</p>
  <ul class="flex-1 lg:px-2 divide-y divide-neutral-400 ">
    <div></div>
    {#if data.recentTransactions.length > 0}
      {#each data.recentTransactions as { type, relatedUser, date, amount }, i (i)}
        {@render transaction(type, relatedUser, date, amount)}
      {/each}
    {:else}
      <p class="w-full bg-neutral-300/10 p-2 text-lg rounded text-center lg:text-left">Não há nenhuma transação recente.</p>
    {/if}
    <div></div>
  </ul>
</div>


<style>
  .credit {
    --credit-color: var(--color-green-500);
    color: var(--credit-color);
  }

  .debit {
    --debit-color: var(--color-red-500);
    color: var(--debit-color);
  }

  @media (prefers-color-scheme: dark) {
    .credit {
      --credit-color: var(--color-green-400);
    }

    .debit {
      --debit-color: var(--color-red-400);
    }
  }
</style>