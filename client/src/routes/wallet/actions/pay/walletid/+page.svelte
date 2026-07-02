<script lang="ts">
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { fly } from 'svelte/transition';

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

<form
  action="?/pay"
  method="post"
  class="grid flex-1 place-items-center px-10 pb-15"
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
        class="col-start-1 row-start-1 flex w-full flex-col overflow-x-hidden"
      >
        <h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">
          Digite ou cole o ID da carteira do recebedor
        </h1>
        <span class="p-3 pl-0">
          <input
            type="text"
            name="reciever"
            id="reciever"
            placeholder="ID da carteira"
            required
            bind:value={userData.reciever}
            class="border-b border-b-teal-500 p-1 text-2xl dark:border-b-teal-400"
          />
        </span>
        <span class="mt-5 flex w-full justify-between gap-2">
          <a
            href={resolve('/wallet/actions/pay')}
            class="w-1/6 cursor-pointer rounded-xl border border-red-500 bg-transparent p-3 text-center font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
            >Cancelar</a
          >
          <button
            type="button"
            disabled={userData.reciever ? false : true}
            onclick={() => {
              moveToNextStep(userData.reciever);
            }}
            class="w-1/4 cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 font-bold transition enabled:hover:bg-teal-500/80 disabled:cursor-default disabled:bg-transparent disabled:text-teal-500 dark:border-teal-400 dark:text-black dark:enabled:hover:bg-teal-500 dark:disabled:text-teal-400"
            >Continuar</button
          >
        </span>
      </div>

    {:else if formStage === 1}
      <div
        in:fly={{ delay: 500 }}
        out:fly
        class="col-start-1 row-start-1 flex w-full flex-col overflow-x-hidden"
      >
        <h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl">
          Digite o valor que deseja transferir
        </h1>
        <span class="p-3 pl-0">
          <label for="amount" class="text-2xl">BL$</label>
          <input
            type="number"
            min="0"
            name="amount"
            id="amount"
            required
            bind:value={userData.amount}
            class="w-[7ch] border-b border-b-teal-500 p-1 text-2xl dark:border-b-teal-400"
          />
        </span>
        <span class="my-5 flex flex-col p-3 pt-0 pl-0">
          <input
            type="text"
            name="description"
            id="description"
            placeholder="Descrição (opcional)"
            bind:value={userData.description}
            class="border-b border-b-teal-500 p-1 text-2xl dark:border-b-teal-400"
          />
        </span>
        <span class="flex w-full justify-between gap-2">
          <span class="flex flex-1 gap-2">
            <button
              type="button"
              onclick={returnStep}
              class="w-1/4 cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 font-bold transition hover:bg-teal-500/80 dark:border-teal-400 dark:text-black dark:hover:bg-teal-500"
              >Voltar</button
            >
            <a
              href={resolve('/wallet/actions/pay')}
              class="w-1/6 cursor-pointer rounded-xl border border-red-500 bg-transparent p-3 text-center font-bold text-red-500 transition hover:bg-[rgba(0,0,0,0.03)] dark:border-red-400 dark:text-red-400 dark:hover:bg-[rgba(255,255,255,0.05)]"
              >Cancelar</a
            >
          </span>
          <button
            type="submit"
            disabled={userData.amount && userData.amount > 0 && userData.reciever ? false : true}
            class="w-1/4 cursor-pointer rounded-xl border border-teal-500 bg-teal-400 p-3 font-bold transition enabled:hover:bg-teal-500/80 disabled:cursor-default disabled:bg-transparent disabled:text-teal-500 dark:border-teal-400 dark:text-black dark:enabled:hover:bg-teal-500 dark:disabled:text-teal-400"
            >Enviar Pagamento</button
          >
        </span>
      </div>
    {/if}

  {:else}
    <div>bruh</div>
  {/if}
</form>
