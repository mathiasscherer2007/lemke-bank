<script lang="ts">
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import userManage from '$lib/assets/icons/manage-users.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';

  import DashboardGrid from '$lib/components/dashboard/DashboardGrid.svelte';
  import DashboardWidget from '$lib/components/dashboard/DashboardWidget.svelte';
  import NavLink from '$lib/components/NavLink.svelte';
  import NavLinkContainer from '$lib/components/NavLinkContainer.svelte';

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

<h1 class="text-2xl lg:text-3xl font-bold pl-2">Ações de Administrador</h1>
<NavLinkContainer columns="4">
  {#each links as { title, icon, link } (link)}
    <NavLink title={title} icon={icon} link={link} />
  {/each}
</NavLinkContainer>

<hr class="border-stone-500 my-6 lg:my-10 mx-2 lg:mx-0" />

<h2 class="mb-3 text-xl font-bold pl-2 lg:text-2xl">Visão Geral da Dashboard</h2>
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