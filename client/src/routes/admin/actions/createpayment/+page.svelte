<script lang="ts">
  import { resolve } from "$app/paths";
  import CancelLink from "$lib/components/elements/Forms/CancelLink.svelte";
  import { enhance } from "$app/forms";

	import arrowIcon from '$lib/assets/icons/arrow-right.svg';

  let submitting = $state(false);
</script>

<!-- for mobile -->
<a href={resolve('/admin')} class="flex aspect-square h-10 items-center text-lg italic lg:hidden">
  <img src={arrowIcon} alt="cancelar" class="aspect-square h-full rotate-180 white-filter" />
  cancelar
</a>

<div class="flex flex-1 items-center justify-center">
  <form
    action="?/createpayment"
    method="POST"
    autocomplete="off"
    class="flex h-full w-full flex-col justify-end overflow-x-hidden lg:h-auto lg:w-1/2 lg:rounded-lg lg:bg-[#00000020] lg:p-5"
    use:enhance={() => {
      submitting = true;

      return ({ update }) => {
        submitting = false;
        update();
      }
    }}
  >
    <h1 class="mb-5 font-[Stack_Sans_Headline] text-3xl">
      Digite os dados do pagamento que será criado
    </h1>
    <span class="p-3 pl-0">
      <label for="amount" class="text-xl lg:text-2xl">BL$</label>
      <input
        type="number"
        step="1"
        min="0"
        name="amount"
        id="amount"
        required
        class="w-[7ch] border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400"
      />
    </span>
    <span class="mt-5 flex p-3 pt-0 pl-0">
      <input
        type="text"
        name="description"
        id="description"
        placeholder="Descrição (opcional)"
        class="flex-1 border-b border-b-teal-500 p-1 text-xl lg:text-2xl dark:border-b-teal-400"
      />
    </span>
	<p class="italic my-3 text-neutral-400">Ao enviar, um link de pagamento com um QRcode será criado, e irá aparecer na tela para ser copiado.</p>
	<span class="flex flex-col mt-10 lg:m-0 lg:flex-row-reverse gap-1">
		<button
		type="submit"
    disabled={submitting}
		class="rounded-lg border p-3 text-lg font-semibold transition enabled:cursor-pointer disabled:cursor-default disabled:bg-transparent disabled:text-teal-400 enabled:border-teal-500 enabled:bg-teal-500 enabled:hover:bg-teal-500/80 lg:w-1/4"
		>{submitting ? '...' : 'Criar Pagamento'}</button
		>
		<CancelLink returnLink='/admin' />
	</span>
  </form>
</div>
