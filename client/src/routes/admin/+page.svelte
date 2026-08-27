<script lang="ts">
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import userManage from '$lib/assets/icons/manage-users.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';
  import type { PageProps } from './$types';


  import DashboardGrid from '$lib/components/dashboard/DashboardGrid.svelte';
  import DashboardWidget from '$lib/components/dashboard/DashboardWidget.svelte';
  import NavLink from '$lib/components/elements/NavLink.svelte';
  import NavLinkContainer from '$lib/components/elements/NavLinkContainer.svelte';

  let { data }: PageProps = $props();

  const links = [
    { title: 'Enviar BL$', icon: payIcon, link: '/admin/actions/transfer' },
    { title: 'Histórico de Envios', icon: statementIcon, link: '/admin/actions/checktransferhistory' },
    { title: 'Gerenciar Usuários', icon: userManage, link: '/admin/actions/usermanage' },
    { title: 'Criar Pagamento', icon: createPayment, link: '/admin/actions/createpayment' }
  ] as const;
</script>

<h1 class="text-2xl lg:text-3xl font-bold pl-2">Ações de Administrador</h1>
<NavLinkContainer columns="4">
  {#each links as { title, icon, link } (link)}
    <NavLink title={title} icon={icon} link={link} />
  {/each}
</NavLinkContainer>

<hr class="border-neutral-500 my-6 lg:my-10 mx-2 lg:mx-0" />

<h2 class="mb-3 text-xl font-bold pl-2 lg:text-2xl">Visão Geral da Dashboard</h2>
<DashboardGrid columns={4}>
  <DashboardWidget title="BL$ em circulação">
    {#snippet content()}
      <p class="my-auto py-5 text-3xl font-bold">BL$ {data.totalBalance}</p>
    {/snippet}
  </DashboardWidget>
  
  <DashboardWidget title="Maiores magnatas" span={2}>
    {#snippet content()}
      {#snippet person(name: string, networth: number, prefix: number)}
        <li
          class="text-md flex items-center justify-between px-2 py-1 {prefix % 2 == 0 ? '' : 'bg-zinc-300/70 dark:bg-black/10'}"
        >
          <span class="flex gap-1 font-semibold">
            {prefix}. <p>{name}</p>
          </span>
          <p>BL$ {networth}</p>
        </li>
      {/snippet}
      <ol class="my-2 w-full rounded">
        {#each data.topEarners as user, i (i)}
          {@render person(user.user.username, user.balance , i + 1)}
        {/each}
      </ol>
    {/snippet}
  </DashboardWidget>
  <DashboardWidget title="Total de usuários">
    {#snippet content()}
      <p class="my-auto py-5 text-3xl font-bold">{data.totalUsers}</p>
    {/snippet}
  </DashboardWidget>
</DashboardGrid>