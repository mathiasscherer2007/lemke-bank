<script lang="ts">
  import { resolve } from '$app/paths';

  import copyIcon from '$lib/assets/icons/copy.svg';
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import arrowinIcon from '$lib/assets/icons/arrow-in.svg';
  import arrowoutIcon from '$lib/assets/icons/arrow-out.svg';
</script>

<div>
  <div class="flex w-full justify-between">
    <p class="text-xl">Saldo atual</p>
    <span class="flex items-center gap-2">
      <p class="text-lg dark:text-gray-300">ID da carteira: 123456</p>
      <button type="button">
        <img
          src={copyIcon}
          alt="Copiar ID"
          class="h-4 w-4 hover:cursor-pointer dark:invert"
          aria-label="Copiar ID"
        />
      </button>
    </span>
  </div>
  <p class="pl-2 text-3xl font-bold">BL$ 30</p>
</div>
<div class="mt-2 flex h-40">
  <a
    href={resolve('/wallet/actions/pay')}
    class="m-3 flex aspect-square flex-col items-center justify-center rounded-xl border border-black p-2 text-center shadow-md transition hover:border-teal-500 dark:border-white dark:bg-[rgb(35,35,35)] dark:hover:border-teal-400"
  >
    <figure class="w-7/11 p-3">
      <img
        src={payIcon}
        alt="Realizar Pagamento"
        class="dark:filter-[brightness(0)_saturate(100%)_invert(100%)_sepia(0%)_saturate(7475%)_hue-rotate(105deg)_brightness(119%)_contrast(100%)]"
      />
    </figure>
    <p class="mb-auto">Realizar Pagamento</p>
  </a>
  <a
    href={resolve('/wallet/statement')}
    class="m-3 flex aspect-square flex-col items-center justify-center rounded-xl border border-black p-2 text-center shadow-md transition hover:border-teal-500 dark:border-white dark:bg-[rgb(35,35,35)] dark:hover:border-teal-400"
  >
    <figure class="w-7/11 p-3">
      <img
        src={statementIcon}
        alt="Extrato"
        class="dark:filter-[brightness(0)_saturate(100%)_invert(100%)_sepia(0%)_saturate(7475%)_hue-rotate(105deg)_brightness(119%)_contrast(100%)]"
      />
    </figure>
    <p class="mb-auto">Verificar Extrato</p>
  </a>
</div>
<hr class="my-6 border-stone-500" />
<div class="flex flex-col">
  <p class="mb-3 text-2xl">Transações recentes</p>
  <ul class="flex-1 px-2">
    <li class="flex justify-between border-y border-stone-500 py-2 text-lg">
      <span class="flex items-center gap-2">
        <figure class="green-filter h-7 w-7 p-1">
          <img src={arrowinIcon} alt="Entrada" />
        </figure>
        <p>Ana P. Lemke</p>
        <p class="text-stone-500 dark:text-stone-400">| 25/03/26</p>
      </span>
      <p class="text-green-500 dark:text-green-400">BL$ 10</p>
    </li>
    <li class="-mt-px flex justify-between border-y border-stone-500 py-2 text-lg">
      <span class="flex items-center gap-2">
        <figure
          class="h-7 w-7 p-1 filter-[brightness(0)_saturate(100%)_invert(71%)_sepia(71%)_saturate(4987%)_hue-rotate(320deg)_brightness(101%)_contrast(106%)]"
        >
          <img src={arrowoutIcon} alt="Saída" />
        </figure>
        <p>Túlio L. Baségio</p>
        <p class="text-stone-500 dark:text-stone-400">| 24/03/26</p>
      </span>
      <p class="text-red-500 dark:text-red-400">-BL$ 6</p>
    </li>
  </ul>
</div>
