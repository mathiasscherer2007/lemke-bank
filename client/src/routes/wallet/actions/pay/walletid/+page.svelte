<script lang="ts">
  import { resolve } from '$app/paths';
  import MultiPartForm from '$lib/components/elements/MultiPartForm/MultiPartForm.svelte';
  import { SvelteMap } from 'svelte/reactivity';

  import arrowIcon from '$lib/assets/icons/arrow-right.svg';

  let fullData: {'receiver': string | null, 'amount': number | null, 'description': string | null} = $state({
    'receiver': null,
    'amount': null,
    'description': null
  });
  let receiverName = $state('');
  let canSubmit = $state(true);

  async function fetchReceiver() {
    const response = await fetch(`/api/wallet?walletId=${fullData.receiver}`, { method: 'GET' });

    if (response.ok) {
      const data = await response.json();
      receiverName = data.user?.username;
      canSubmit = true;
    } else {
      receiverName = 'Nenhum usuário encontrado.';
      canSubmit = false;
    }
  }

  let loadEvents = new SvelteMap<number, () => void>();
  loadEvents.set(1, fetchReceiver)

  function resetOnSubmit() {
    Object.keys(fullData).forEach(key => {
      fullData[key as keyof typeof fullData] = null;
    })
  }
</script>

{#snippet walletId()}
  <div>
    <h1 class="mb-6 font-[Stack_Sans_Headline] text-3xl">Digite ou cole o ID da carteira do recebedor</h1>
    <span class="my-5 flex lg:block">
      <input
        type="text"
        name="receiver"
        id="receiver"
        placeholder="ID da carteira"
        required
        bind:value={fullData.receiver}
        class="flex-1 border-b border-b-teal-500 p-1 text-2xl w-full dark:border-b-teal-400"
      />
    </span>
  </div>
{/snippet}

{#snippet amountDescription()}
  <div>
    <h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">Digite o valor que será transferido</h1>
    <div class="my-5 p-1 lg:p-0 flex flex-col gap-2 text-xl">
      <p>Recebedor: {receiverName ? receiverName : '...'}</p>
      <p>Data da transferência: {new Date().toLocaleDateString('pt-BR')}</p>
    </div>
    <span class="p-3 pl-0">
      <label for="amount" class="text-xl lg:text-2xl">BL$</label>
      <input
        type="number"
        step="1"
        min="0"
        name="amount"
        id="amount"
        required
        bind:value={fullData.amount}
        class="w-[7ch] border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400"
      />
    </span>
    <span class="my-5 flex p-3 pt-0 pl-0">
      <input
        type="text"
        name="description"
        id="description"
        placeholder="Descrição (opcional)"
        bind:value={fullData.description}
        class="flex-1 border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400"
      />
    </span>
  </div>
{/snippet}

{#snippet awaiting()}
  <div>Esperando resposta do servidor...</div>
{/snippet}

<a href={resolve('/wallet/overview')} class="flex aspect-square h-10 items-center text-lg lg:hidden">
  <img src={arrowIcon} alt="cancelar" class="aspect-square h-full rotate-180 white-filter" />
  cancelar
</a>

<div class="flex-1 flex justify-center items-center">
  <div class="flex-1 lg:max-w-1/2 grid">
    <MultiPartForm 
      returnLink='/wallet/actions/pay' 
      formAction='?/pay' 
      submittingSnippet={awaiting} 
      steps={[walletId, amountDescription]} 
      {loadEvents} 
      submitObject={fullData}
      {resetOnSubmit}
      valuesToCheck={[fullData.amount, fullData.receiver, canSubmit]} 
    />
  </div>
</div>

<style>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
</style>