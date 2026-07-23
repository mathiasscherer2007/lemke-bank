<script lang="ts">
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import userSearch from '$lib/assets/icons/user-search.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';

  import SquareLink from '$lib/components/SquareLink.svelte';
    import DashboardGrid from '$lib/components/dashboard/DashboardGrid.svelte';
    import DashboardWidget from '$lib/components/dashboard/DashboardWidget.svelte';

  const links = [
    { title: 'Enviar BL$', icon: payIcon, link: '/admin/transfer' },
    { title: 'Histórico de Envios', icon: statementIcon, link: '/admin/transferhistory' },
    { title: 'Pesquisar Usuários', icon: userSearch, link: '/admin/usersearch' },
    { title: 'Criar Pagamento', icon: createPayment, link: '/admin/createpayment' }
  ] as const;

  let magnates = [
    { username: "Mathias Scherer", balance: 100},
    { username: "Nícolas Kochhann", balance: 68},
    { username: "Thaila Jesus", balance: 56},
  ]
</script>

<h1 class="lg:pl-2 text-2xl lg:text-3xl font-bold">Ações de Administrador</h1>
<div class="mt-2 flex h-30 overflow-x-auto overflow-y-hidden lg:h-40">
  {#each links as { title, icon, link } (link)}
    <SquareLink {title} {icon} {link} />
  {/each}
</div>

<hr class="my-4 lg:my-6 border-stone-500" />

<h2 class="lg:pl-2 text-xl lg:text-2xl font-bold mb-3">Visão Geral da Dashboard</h2>
<DashboardGrid gap="1ch" columns={4}>
  <DashboardWidget title="BL$ em circulação">
    {#snippet content()}
      <p class="text-2xl font-bold my-auto py-5">BL$ 1</p>
    {/snippet}
  </DashboardWidget>
  <DashboardWidget title="Maiores magnatas" span={3}>
    {#snippet content()}
      {#snippet person(name: string, networth: number, prefix: number)}
        <li class="flex items-center justify-between py-1 px-2 text-md {prefix % 2 == 0 ? "" : "bg-stone-800/35"}">
          <span class="flex gap-1 font-semibold">
            {prefix}.
            <p>{name}</p>
          </span>
          <p>BL$ {networth}</p>
        </li>
      {/snippet}
      <ol class="w-full rounded my-2">
        {#each magnates as { username, balance }, index (username)}
          {@render person(username, balance, index+1)}
        {/each}
      </ol>
    {/snippet}
  </DashboardWidget>
</DashboardGrid>