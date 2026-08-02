<script lang="ts">
  import type { PageProps } from './$types';
  import trashIcon from '$lib/assets/icons/trash.svg';
  import editIcon from '$lib/assets/icons/user-pen.svg';
  import type { Attachment } from 'svelte/attachments';
  import tippy from 'tippy.js';

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
    {#each data.users as { username, email, walletid, active, balance } (walletid)}
      <tr>
        <td>{username}</td>
        <td>{email}</td>
        <td>{walletid}</td>
        <td class="p-1">
          <div class="active-{active} w-fit justify-self-center rounded px-2 py-1 text-center">
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
