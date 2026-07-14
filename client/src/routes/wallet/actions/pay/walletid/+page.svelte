<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { fly } from 'svelte/transition';

  import arrowIcon from '$lib/assets/icons/arrow-right.svg';

  let submitting = $state(false);
  let formStage = $state(0);
  let userData = $state({
    reciever: '',
    amount: 0,
    description: ''
  });
  let reciever = $state('');

  function moveToNextStep(valueToCheck: string | number) {
    if (!valueToCheck) {
      return;
    }

    formStage++;

    if (formStage === 1) {
      fetchReciever();
    }
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

  async function fetchReciever() {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    reciever = 'Sr. Dinheiros';
  }
</script>

<a
  href={resolve('/wallet/actions/pay')}
  class="flex aspect-square h-10 items-center text-lg italic lg:hidden"
>
  <img src={arrowIcon} alt="cancelar" class="aspect-square h-full rotate-180 white-filter" />
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

    return async ({ update }) => {
      submitting = false;
      userData = {
        reciever: '',
        amount: 0,
        description: ''
      };

      await update();
    };
  }}
>
  {#if !submitting}
    {#if formStage === 0}
      <div
        in:fly={{ delay: 500 }}
        out:fly
        class="col-start-1 row-start-1 flex h-full w-full flex-col justify-end overflow-x-hidden lg:h-auto"
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
              class="flex-1 border-b border-b-teal-500 p-1 text-2xl lg:flex-none dark:border-b-teal-400"
            />
          </span>
        </div>
        <span class="mb-5 flex w-full flex-col justify-between gap-2 lg:mt-5 lg:flex-row">
          <a
            href={resolve('/wallet/actions/pay')}
            class="hidden cursor-pointer rounded-xl border border-red-500 bg-transparent p-3 text-center text-xl font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] lg:inline lg:w-1/6 lg:text-lg dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
            >Cancelar</a
          >
          <button
            type="button"
            disabled={userData.reciever ? false : true}
            onclick={() => {
              moveToNextStep(userData.reciever);
            }}
            class="cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 text-xl font-bold transition enabled:hover:bg-teal-500/80 disabled:cursor-default disabled:bg-transparent disabled:text-teal-500 lg:w-1/4 lg:text-lg dark:border-teal-400 dark:text-black dark:enabled:hover:bg-teal-500 dark:disabled:text-teal-400"
            >Continuar</button
          >
        </span>
      </div>
    {:else if formStage === 1}
      <div
        in:fly={{ delay: 500 }}
        out:fly
        class="col-start-1 row-start-1 flex h-full w-full flex-col justify-end overflow-x-hidden lg:h-auto"
      >
        <div class="my-auto">
          <h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">
            Digite o valor que será transferido
          </h1>
          <div class="mt-5 mb-3 flex flex-col gap-2 text-xl">
            <b>Recebedor: {reciever ? reciever : '...'}</b>
            <p>Data da transferência: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
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
              class="flex-1 border-b border-b-teal-500 p-1 text-lg lg:text-2xl dark:border-b-teal-400"
            />
          </span>
        </div>
        <span class="flex w-full flex-col justify-between gap-2 pb-5 lg:flex-row">
          <span class="flex flex-1 gap-2">
            <button
              type="button"
              onclick={returnStep}
              class="flex-1 cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 text-xl font-bold transition hover:bg-teal-500/80 lg:w-1/4 lg:flex-none lg:text-lg dark:border-teal-400 dark:text-black dark:hover:bg-teal-500"
              >Voltar</button
            >
            <a
              href={resolve('/wallet/actions/pay')}
              class="hidden w-1/6 cursor-pointer rounded-xl border border-red-500 bg-transparent p-3 text-center font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] lg:inline dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
              >Cancelar</a
            >
          </span>
          <button
            type="submit"
            disabled={userData.amount && userData.amount > 0 && userData.reciever ? false : true}
            class="flex-1 cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 text-xl font-bold transition enabled:hover:bg-teal-500/80 disabled:cursor-default disabled:bg-transparent disabled:text-teal-500 lg:w-1/4 lg:flex-none lg:text-lg dark:border-teal-400 dark:text-black dark:enabled:hover:bg-teal-500 dark:disabled:text-teal-400"
            >Enviar Pagamento</button
          >
        </span>
      </div>
    {/if}
  {:else}
    <div>Esperando resposta do servidor...</div>
  {/if}
</form>
