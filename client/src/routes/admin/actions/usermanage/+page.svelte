<script lang="ts">
  import type { PageProps } from './$types';
  import type { Attachment } from 'svelte/attachments';
  import tippy from 'tippy.js';

  import trashIcon from '$lib/assets/icons/trash.svg';
  import editIcon from '$lib/assets/icons/user-pen.svg';
  import arrowIcon from '$lib/assets/icons/arrow-right.svg';

  let { data }: PageProps = $props();

  function tooltip(content: string): Attachment {
	return (element) => {
	  const tooltip = tippy(element, { content, animation:'fade' });
	  return tooltip.destroy;
	}
  }
</script>

<svelte:head>
  <title>Usuários | LemkeBank</title>
</svelte:head>

<div class="mb-3 flex items-center justify-between">
  <h1 class="text-2xl font-bold lg:text-3xl">Lista de Usuários</h1>
  <button
    type="button"
    class="rounded bg-teal-500 p-2 font-semibold transition hover:cursor-pointer hover:bg-teal-500/90"
    >+ Criar Usuário</button
  >
</div>

{#snippet userAdminActions()}
  <button {@attach tooltip('Editar')} class="white-filter w-10 p-2 border rounded hover:cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
	<img src={editIcon} alt="editar usuário">
  </button>
  <button {@attach tooltip('Deletar')} class="white-filter w-10 p-2 border rounded hover:cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition">
	<img src={trashIcon} alt="deletar usuário">
  </button>
{/snippet}
<div class="overflow-x-auto px-5 mt-5">
  <table class="w-full rounded-lg border-collapse table-fixed">
    <thead>
      <tr>
        <th class="table-header rounded-tl border-r text-left">Nome de Usuário</th>
        <th class="table-header border-r text-left">Email</th>
        <th class="table-header border-r text-left">WalletID</th>
        <th class="table-header border-r">Status da Conta</th>
        <th class="table-header border-r">Saldo (BL$)</th>
        <th class="table-header rounded-tr w-30">Ações</th>
      </tr>
    </thead>
    <tbody>
      {#each data.users as { username, email, walletid, active, balance } (walletid)}
        <tr class="border-b border-neutral-600">
          <td title={username} class="cell">{username}</td>
          <td title={email} class="cell">{email}</td>
          <td title={walletid} class="cell">{walletid}</td>
          <td class="cell">
            <div class="active-{active} w-fit justify-self-center rounded px-2 py-1 text-center">
              {active ? 'Ativa' : 'Inativa'}
            </div>
          </td>
          <td title={balance} class="cell text-center">{balance}</td>
          <td class="cell">
            <div class="flex h-full items-center justify-center gap-2">
              {@render userAdminActions()}
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<div class="flex flex-row-reverse px-5 py-3">
  <span class="flex h-10 white-filter items-center gap-2">
    <button class="h-9 p-1 border rounded hover:bg-black/5 dark:hover:bg-white/5 hover:cursor-pointer"><img src={arrowIcon} alt="<" class="rotate-180 h-full"></button>
    <p>1</p>
    <button class="h-9 p-1 border rounded hover:bg-black/5 dark:hover:bg-white/5 hover:cursor-pointer"><img src={arrowIcon} alt=">" class="h-full"></button>
  </span>
</div>

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

  .table-header {
    padding: var(--spacing) calc(var(--spacing) * 2);
    background-color: var(--color-teal-500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cell {
    padding: var(--spacing) calc(var(--spacing) * 2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
