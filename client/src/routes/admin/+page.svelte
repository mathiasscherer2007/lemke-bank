<script lang="ts">
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import userSearch from '$lib/assets/icons/user-search.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';

  import SquareLink from '$lib/components/SquareLink.svelte';

  const links = [
    { title: 'Enviar BL$', icon: payIcon, link: '/admin/transfer' },
    { title: 'Histórico de Envios', icon: statementIcon, link: '/admin/transferhistory' },
    { title: 'Pesquisar Usuários', icon: userSearch, link: '/admin/usersearch' },
    { title: 'Criar Pagamento', icon: createPayment, link: '/admin/createpayment' }
  ] as const;
</script>

<h1 class="lg:pl-2 text-2xl lg:text-3xl font-bold">Ações de Administrador</h1>
<div class="mt-2 flex h-30 overflow-x-auto overflow-y-hidden lg:h-40">
  {#each links as { title, icon, link } (link)}
    <SquareLink {title} {icon} {link} />
  {/each}
</div>
<hr class="my-4 lg:my-6 border-stone-500" />
<h2 class="lg:pl-2 text-xl lg:text-2xl font-bold">Visão Geral da Dashboard</h2>
