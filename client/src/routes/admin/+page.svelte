<script lang="ts">
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import userManage from '$lib/assets/icons/manage-users.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';
  import arrowRight from '$lib/assets/icons/arrow-right.svg';

  import DashboardGrid from '$lib/components/dashboard/DashboardGrid.svelte';
  import DashboardWidget from '$lib/components/dashboard/DashboardWidget.svelte';
  import SquareLink from '$lib/components/SquareLink.svelte';

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
    class="group rounded-xl border border-black p-3 transition hover:border-teal-500 dark:border-white dark:bg-[#282828] dark:hover:border-teal-400"
  >
    <div class="flex items-center">
      <span class="flex items-center gap-3">
        <img src={icon} alt={title} class="aspect-square w-1/5 p-1 lg:p-3 white-filter" />
        <p class="text-lg font-semibold">{title}</p>
      </span>
      <img src={arrowRight} alt="" class="w-1/11 lg:w-1/10 white-filter group-hover:teal-filter transition" />
    </div>
  </a>
{/snippet}

<!-- what -->
<h1 class="text-2xl lg:text-3xl font-bold pl-2">Ações de Administrador</h1>
<div class="hidden lg:grid mt-3 gap-3 grid-rows-4 lg:grid-rows-none lg:grid-cols-4 px-3">
  {#each links as { title, icon, link } (link)}
    {@render AdminLink(title, icon, link)}
  {/each}
</div>
<div class="mt-2 px-2 flex lg:hidden h-30 overflow-x-auto overflow-y-hidden scrollbar-none">
  {#each links as { title, icon, link } (link)}
    <SquareLink title={title} icon={icon} link={link} />
  {/each}
</div>

<hr class="border-stone-500 my-6 lg:my-10 mx-2 lg:mx-0" />

<h2 class="mb-3 text-xl font-bold pl-2 lg:text-2xl">Visão Geral da Dashboard</h2>
<div class="px-3 lg:px-0">
  <DashboardGrid columns={4}>
    <DashboardWidget title="BL$ em circulação">
      {#snippet content()}
        <p class="my-auto py-5 text-3xl font-bold">BL$ 1</p>
      {/snippet}
    </DashboardWidget>
    
    <DashboardWidget title="Maiores magnatas" span={2}>
      {#snippet content()}
        {#snippet person(name: string, networth: number, prefix: number)}
          <li
            class="text-md flex items-center justify-between px-2 py-1 {prefix % 2 == 0 ? '' : 'bg-stone-800/35'}"
          >
            <span class="flex gap-1 font-semibold">
              {prefix}. <p>{name}</p>
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
</div>