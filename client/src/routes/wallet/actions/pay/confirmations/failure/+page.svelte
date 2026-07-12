<script lang="ts">
  import { resolve } from '$app/paths';
  import errorIcon from '$lib/assets/icons/circle-cross.svg';
  import Progressbar from '$lib/components/Progressbar.svelte';
</script>

<figure class="aspect-square h-30 red-filter">
  <img src={errorIcon} alt="Error" />
</figure>
<h2 class="my-5 text-3xl font-bold italic">Algo deu errado!</h2>
<p>Seu pagamento não pode ser concluído.</p>
<p>Você será redirecionado em breve.</p>
<a href={resolve('/wallet/overview')} class="my-1 text-teal-500 dark:text-teal-400 underline">Voltar para página inicial</a>
<Progressbar duration="10000" color="red" />
