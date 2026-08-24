<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import errorIcon from '$lib/assets/icons/circle-cross.svg';
  import Progressbar from '$lib/components/elements/Progressbar.svelte';

  const message = page.url.searchParams.get('message') ?? 'Seu pagamento não pôde ser concluído. Sua conta não foi debitada.';
</script>

<figure class="aspect-square h-30 red-filter">
  <img src={errorIcon} alt="Error" />
</figure>
<h2 class="mt-5 text-3xl font-bold italic">Algo deu errado!</h2>
<p class="my-4 text-lg font-semibold">{message}</p>
<p>Você será redirecionado em breve.</p>
<a href={resolve('/wallet/overview')} class="my-1 text-teal-500 dark:text-teal-400 underline">Voltar para página inicial</a>
<Progressbar duration="10000" color="red" />
