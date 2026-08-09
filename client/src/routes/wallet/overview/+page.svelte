<script lang="ts">
  import arrowinIcon from '$lib/assets/icons/arrow-in.svg';
  import arrowoutIcon from '$lib/assets/icons/arrow-out.svg';
  import payIcon from '$lib/assets/icons/pay.svg';
  import statementIcon from '$lib/assets/icons/statement.svg';
  import createPayment from '$lib/assets/icons/create-payment.svg';

  import CopyButton from '$lib/components/elements/CopyButton.svelte';
  import NavLink from '$lib/components/elements/NavLink.svelte';
  import NavLinkContainer from '$lib/components/elements/NavLinkContainer.svelte';

  const links = [
    {title: 'Realizar Pagamento', icon: payIcon, link: '/wallet/actions/pay'},
    {title: 'Verificar Extrato', icon: statementIcon, link: '/wallet/actions/checkstatement'},
    {title: 'Criar Pagamento', icon: createPayment, link: '/wallet/actions/createpayment'}
  ] as const;

  let idElement: HTMLElement | undefined = $state();
</script>

<svelte:head>
  <title>Carteira | LemkeBank</title>
</svelte:head>

<div>
  <div class="flex w-full justify-between">
    <p class="text-xl">Saldo atual</p>
    <span class="flex items-center gap-2">
      <span class="text-lg">ID: <span bind:this={idElement}>123456</span></span>
      <span class="h-5 aspect-square my-auto">
        <CopyButton elementToCopy={idElement} tooltipPosition='bottom' tooltipText='Copiar ID' />
      </span>
    </span>
  </div>
  <p class="lg:pl-2 text-2xl lg:text-3xl font-bold">BL$ 30</p>
</div>
<NavLinkContainer columns="3">
  {#each links as { title, icon, link } (link)}
    <NavLink title={title} icon={icon} {link} />
  {/each}
</NavLinkContainer>
<hr class="my-4 lg:my-6 border-neutral-500" />
<div class="flex flex-col">
  <p class="mb-3 text-xl lg:text-2xl">Transações recentes</p>
  <ul class="flex-1 lg:px-2">
    <li class="flex justify-between border-y border-neutral-500 py-2 text-lg">
      <span class="flex items-center gap-2">
        <figure class="green-filter h-7 w-7 p-1">
          <img src={arrowinIcon} alt="Entrada" />
        </figure>
        <p>Ana Lemke</p>
        <p class="text-neutral-500 dark:text-neutral-400">| 25/03/26</p>
      </span>
      <p class="text-green-500 dark:text-green-400">BL$ 10</p>
    </li>
    <li class="-mt-px flex justify-between border-y border-neutral-500 py-2 text-lg">
      <span class="flex items-center gap-2">
        <figure
          class="h-7 w-7 p-1 filter-[brightness(0)_saturate(100%)_invert(71%)_sepia(71%)_saturate(4987%)_hue-rotate(320deg)_brightness(101%)_contrast(106%)]"
        >
          <img src={arrowoutIcon} alt="Saída" />
        </figure>
        <p>Túlio Baségio</p>
        <p class="text-neutral-500 dark:text-neutral-400">| 24/03/26</p>
      </span>
      <p class="text-red-500 dark:text-red-400">-BL$ 6</p>
    </li>
  </ul>
</div>
