<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { fly } from 'svelte/transition';

  import arrowIcon from "$lib/assets/icons/arrow-right.svg";

  let submitting = $state(false);
  let formStage = $state(0);
  let userData = $state({
    reciever: '',
    amount: 0,
    description: ''
  });

  function moveToNextStep(valueToCheck: string | number) {
    if (!valueToCheck) {
      return;
    }

    formStage++;
  }

  function checkValues() {
    if (userData.amount < 0 || !userData.amount) {
      return false;
    }
    if (!userData.reciever) {
      return false;
    }

    return true;
  }

  function returnStep() {
    formStage--;
  }
</script>

<a href={resolve('/wallet/actions/pay')} class="lg:hidden aspect-square h-10 flex items-center text-lg italic">
  <img src={arrowIcon} alt="cancelar" class="white-filter rotate-180 h-full aspect-square">
  cancelar
</a>
<form
  action="?/pay"
  method="post"
  class="grid flex-1 place-items-center lg:px-10 lg:pb-15"
  autocomplete="off"
  use:enhance={({ cancel, formData }) => {
    if (!checkValues) {
      cancel();
    }

    submitting = true;
    formData.append('reciever', userData.reciever);

    return () => {
      submitting = false;
    };
  }}
>
  {#if !submitting}
    {#if formStage === 0}
      <div
        in:fly={{ delay: 500 }}
        out:fly
        class="h-full lg:h-auto col-start-1 row-start-1 flex w-full flex-col justify-end overflow-x-hidden"
      >
        <div class="my-auto">
          <h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">
            Digite ou cole o ID da carteira do recebedor
          </h1>
          <span class="m-3 ml-0 flex lg:block">
            <input
              type="text"
              name="reciever"
              id="reciever"
              placeholder="ID da carteira"
              required
              bind:value={userData.reciever}
              class="border-b border-b-teal-500 p-1 text-2xl dark:border-b-teal-400 flex-1 lg:flex-none"
            />
          </span>
        </div>
        <span class="mb-5 lg:mt-5 flex flex-col lg:flex-row w-full justify-between gap-2">
          <a
            href={resolve('/wallet/actions/pay')}
            class="hidden lg:inline lg:w-1/6 text-xl lg:text-lg cursor-pointer rounded-xl border border-red-500 bg-transparent p-3 text-center font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
            >Cancelar</a
          >
          <button
            type="button"
            disabled={userData.reciever ? false : true}
            onclick={() => {
              moveToNextStep(userData.reciever);
            }}
            class="lg:w-1/4 text-xl lg:text-lg cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 font-bold transition enabled:hover:bg-teal-500/80 disabled:cursor-default disabled:bg-transparent disabled:text-teal-500 dark:border-teal-400 dark:text-black dark:enabled:hover:bg-teal-500 dark:disabled:text-teal-400"
            >Continuar</button
          >
        </span>
      </div>

    {:else if formStage === 1}
      <div
        in:fly={{ delay: 500 }}
        out:fly
        class="h-full lg:h-auto col-start-1 row-start-1 flex w-full flex-col justify-end overflow-x-hidden"
      >
        <div class="my-auto">
          <h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">
            Digite o valor que será transferido
          </h1>
          <span class="p-3 pl-0">
            <label for="amount" class="text-xl lg:text-2xl">BL$</label>
            <input
              type="number"
              min="0"
              name="amount"
              id="amount"
              required
              bind:value={userData.amount}
              class="w-[7ch] border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400"
            />
          </span>
          <span class="my-5 flex p-3 pt-0 pl-0">
            <input
              type="text"
              name="description"
              id="description"
              placeholder="Descrição (opcional)"
              bind:value={userData.description}
              class="border-b flex-1 border-b-teal-500 p-1 text-lg lg:text-2xl dark:border-b-teal-400"
            />
          </span>
        </div>
        <span class="flex flex-col lg:flex-row w-full justify-between gap-2 pb-5">
          <span class="flex flex-1 gap-2">
            <button
              type="button"
              onclick={returnStep}
              class="text-xl lg:text-lg lg:w-1/4 flex-1 lg:flex-none cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 font-bold transition hover:bg-teal-500/80 dark:border-teal-400 dark:text-black dark:hover:bg-teal-500"
              >Voltar</button
            >
            <a
              href={resolve('/wallet/actions/pay')}
              class="hidden lg:inline w-1/6 cursor-pointer rounded-xl border border-red-500 bg-transparent p-3 text-center font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
              >Cancelar</a
            >
          </span>
          <button
            type="submit"
            disabled={userData.amount && userData.amount > 0 && userData.reciever ? false : true}
            class="text-xl lg:text-lg lg:w-1/4 flex-1 lg:flex-none cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 font-bold transition enabled:hover:bg-teal-500/80 disabled:cursor-default disabled:bg-transparent disabled:text-teal-500 dark:border-teal-400 dark:text-black dark:enabled:hover:bg-teal-500 dark:disabled:text-teal-400"
            >Enviar Pagamento</button
          >
        </span>
      </div>
    {/if}

  {:else}
    <div>bruh</div>
  {/if}
</form>
