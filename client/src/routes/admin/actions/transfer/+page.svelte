<script lang="ts">
  import MultiPartForm from "$lib/components/elements/MultiPartForm/MultiPartForm.svelte";
  import { slide } from "svelte/transition";
  import { resolve } from "$app/paths";
  import { onMount } from "svelte";

  import trashIcon from '$lib/assets/icons/trash.svg';
  import arrowIcon from '$lib/assets/icons/arrow-right.svg';
  

  interface Receiver {
    name: string,
    walletId: string
  }

	let fullData: {'walletIds': Array<string>, 'amount': string, 'description'?: string} = $state({'walletIds': [], 'amount': '', 'description': ''});

  let searchedNames: Array<Receiver> = $state([]);
  let focused = $state(false);
  let searchItem = $state('');
  let selectedUsers: Array<Receiver> = $state([]);

  function toggleFocused(): void {
    focused = !focused;
  };

  async function searchNames() {
    searchedNames.length = 0;
    if (!searchItem) { return };

    // wait for server...
    await new Promise((resolve) => setTimeout(resolve, 300));

    searchedNames = [
      {
        name: 'Nicolas Kochhann',
        walletId: '123123'
      },
      {
        name: 'Mathias Scherer',
        walletId: '321321'
      },
      {
        name: 'Thaila Jesuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuus',
        walletId: '123412'
      }
    ]
  }

  function addToReceivers(user: string, walletId: string) {
    searchItem = '';
    searchedNames = [];
    fullData.walletIds.push(walletId);
    selectedUsers.push({ 'name': user, 'walletId': walletId });
  }

  function removeSelectedUser(walletId: string) {
    fullData.walletIds = fullData.walletIds.filter(item => item != walletId);
    selectedUsers = selectedUsers.filter(item => item.walletId !== walletId);
  }

  onMount(() => {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });
  })
</script>

<!-- for mobile -->
<a href={resolve('/admin')} class="flex aspect-square h-10 items-center text-lg italic lg:hidden">
  <img src={arrowIcon} alt="cancelar" class="aspect-square h-full rotate-180 white-filter" />
  cancelar
</a>

{#snippet receivers()}
	<h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">Selecione os recebedores</h1>
  <div class="w-full relative flex flex-col my-5">
    <input type="text" id="1" onfocusin={toggleFocused} onfocusout={toggleFocused} oninput={searchNames} bind:value={searchItem} placeholder="Pesquise por nome/email/walletID" class="flex-1 border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400">
    {#if searchedNames && focused}
      <ul class="absolute top-full z-50 flex flex-col max-w-full bg-neutral-100 dark:bg-neutral-700 rounded-b">
        {#each searchedNames as { name, walletId } (walletId)}
          <button type="button" class="flex-1 flex gap-1 p-1 hover:bg-teal-400/20 dark:hover:bg-teal-500/25 hover:cursor-pointer" onmousedown={() => {addToReceivers(name, walletId)}}>
            <p class="w-fit max-w-1/2 text-ellipsis overflow-clip whitespace-nowrap">{name}</p><p>| {walletId}</p>
          </button>
        {/each}
      </ul>
    {/if}
  </div>
  <h3 class="text-lg font-semibold">Usuários Selecionados</h3>
  <div class="px-1 rounded bg-neutral-300/70 dark:bg-neutral-700/30 overflow-y-scroll scrollbar-none scrollbar-track-transparent scrollbar-thumb-neutral-500 scrollbar-gutter-stable lg:scrollbar-thin mb-3">
    <ul class="h-40 max-w-full divide-y divide-neutral-50/25">
    {#if selectedUsers.length > 0}
      {#each selectedUsers as { name, walletId } (walletId)}
        <li out:slide class="flex justify-between px-1 py-1 hover:bg-neutral-300/95 dark:hover:bg-neutral-700/70 transition">
          <span class="flex-1 max-w-3/4 lg:max-w-2/3 flex gap-2 items-center">
            <span class="w-fit max-w-1/2 text-ellipsis overflow-clip whitespace-nowrap">{name}</span>
            <div class="bg-neutral-400 h-5 w-0.5 rounded"></div>
            <span class="opacity-50">{walletId}</span>
          </span>
          <button type="button" onclick={() => {removeSelectedUser(walletId)}} class="white-filter w-7 p-0.5 cursor-pointer hover:red-filter">
            <img src={trashIcon} alt="deletar">
          </button>
        </li>
      {/each}
    {:else}
      <p class="px-1 py-1 italic opacity-75">Nenhum usuário selecionado</p>
    {/if}
    </ul>
  </div>
{/snippet}

{#snippet amountDescription()}
  <div>
    <h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">Digite o valor que será transferido</h1>
    <div class="my-5 p-1 lg:p-0 flex flex-col gap-2 text-xl">
      <p>Data da transferência: {new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    <span class="p-3 pl-0">
      <label for="amount" class="text-xl lg:text-2xl">BL$</label>
      <input
        type="number"
        step="1"
        min="0"
        id="amount"
        required
        bind:value={fullData.amount}
        class="w-[7ch] border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400"
      />
    </span>
    <span class="my-5 flex p-3 pt-0 pl-0">
      <input
        type="text"
        id="description"
        placeholder="Descrição (opcional)"
        bind:value={fullData.description}
        class="flex-1 border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400"
      />
    </span>
  </div>
{/snippet}

{#snippet awaiting()}
	<div>Esperando resposta...</div>
{/snippet}

<div class="flex-1 flex justify-center items-center">
  <div class="flex-1 lg:max-w-1/2 grid">
    <MultiPartForm 
      returnLink='/admin' 
      formAction='?/transfer' 
      submittingSnippet={awaiting} 
      submitMessage='Enviar BL$'
      steps={[receivers, amountDescription]} 
      valuesToCheck={[fullData.walletIds.length, fullData.amount]}
      submitObject={fullData}
    />
  </div>
</div>