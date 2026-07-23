<script lang="ts">
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import userManage from '$lib/assets/icons/manage-users.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';
  import arrowRight from '$lib/assets/icons/arrow-right.svg';

  import DashboardGrid from '$lib/components/dashboard/DashboardGrid.svelte';
  import DashboardWidget from '$lib/components/dashboard/DashboardWidget.svelte';

  const links = [
    { title: 'Enviar BL$', icon: payIcon, link: '/admin/transfer' },
    { title: 'Histórico de Envios', icon: statementIcon, link: '/admin/transferhistory' },
    { title: 'Gerenciar Usuários', icon: userManage, link: '/admin/usermanage' },
    { title: 'Criar Pagamento', icon: createPayment, link: '/admin/createpayment' }
  ] as const;

  let magnates = [
    { username: 'Mathias Scherer', balance: 100 },
    { username: 'Nícolas Kochhann', balance: 68 },
    { username: 'Thaila Jesus', balance: 56 }
  ];
</script>

{#snippet AdminLink(title: string, icon: string, link: string)}
  <a
    href={link}
    class="hover rounded-xl border border-black p-3 transition hover:border-teal-500 dark:border-white dark:bg-[#282828] dark:hover:border-teal-400"
  >
    <div class="flex items-center">
      <span class="flex items-center gap-3">
        <img src={icon} alt={title} class="aspect-square w-1/5 p-2 white-filter" />
        <p class="text-lg font-semibold">{title}</p>
      </span>
      <img src={arrowRight} alt="" class="w-1/10 white-filter" />
    </div>
  </a>
{/snippet}

<h1 class="text-2xl font-bold lg:pl-2 lg:text-3xl">Ações de Administrador</h1>
<div class="mt-3 grid gap-3" style="grid-template-columns: repeat(4, minmax(0, 1fr));">
  {#each links as { title, icon, link } (link)}
    {@render AdminLink(title, icon, link)}
  {/each}
</div>

<hr class="my-8 border-stone-500 lg:my-10" />

<h2 class="mb-3 text-xl font-bold lg:pl-2 lg:text-2xl">Visão Geral da Dashboard</h2>
<DashboardGrid gap="1ch" columns={4}>
  <DashboardWidget title="BL$ em circulação">
    {#snippet content()}
      <p class="my-auto py-5 text-3xl font-bold">BL$ 1</p>
    {/snippet}
  </DashboardWidget>
  <DashboardWidget title="Maiores magnatas" span={2}>
    {#snippet content()}
      {#snippet person(name: string, networth: number, prefix: number)}
        <li
          class="text-md flex items-center justify-between px-2 py-1 {prefix % 2 == 0
            ? ''
            : 'bg-stone-800/35'}"
        >
          <span class="flex gap-1 font-semibold">
            {prefix}.
            <p>{name}</p>
          </span>
          <p>BL$ {networth}</p>
        </li>
      {/snippet}
      <ol class="my-2 w-full rounded">
        {#each magnates as { username, balance }, index (username)}
          {@render person(username, balance, index + 1)}
        {/each}
      </ol>
    {/snippet}
  </DashboardWidget>
  <DashboardWidget title="Total de usuários">
    {#snippet content()}
      <p class="my-auto py-5 text-3xl font-bold">5</p>
    {/snippet}
  </DashboardWidget>
</DashboardGrid>
