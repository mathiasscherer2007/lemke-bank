<script lang="ts">
  import { resolve } from '$app/paths';
  import successIcon from '$lib/assets/icons/check-circle.svg';
  import Progressbar from '$lib/components/Progressbar.svelte';
</script>

<figure class="aspect-square h-30 green-filter">
  <img src={successIcon} alt="Sucesso" />
</figure>
<h2 class="my-5 text-3xl font-bold italic">Transferência concluída!</h2>
<p>Seu pagamento foi concluído com sucesso.</p>
<p>Você será redirecionado em breve.</p>
<a href={resolve('/wallet/overview')} class="mt-2 text-teal-500 dark:text-teal-400 underline">Voltar para página inicial</a>
<Progressbar duration="10000" color="green" />
