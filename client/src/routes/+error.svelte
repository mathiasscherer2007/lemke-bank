<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';

  import errorIcon from '$lib/assets/icons/error.svg';

  import MainHeader from '$lib/components/MainHeader.svelte';
  import MainFooter from '$lib/components/MainFooter.svelte';
</script>

<svelte:head>
  <title>Erro | LemkeBank</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
  <MainHeader />
  <main class="flex flex-1 flex-col bg-stone-200 px-20 dark:bg-[rgb(27,27,26)]">
    <div class="flex flex-col items-center justify-center flex-1 bg-stone-100 px-15 py-10 text-stone-900 dark:bg-[rgb(46,46,45)] dark:text-white">
      <img src={errorIcon} alt="Error Icon" class="w-25 h-25 dark:invert" />
      <h1 class="text-3xl font-bold mb-4">Algo deu errado!</h1>
      <p class="italic">{page?.status} - {page?.error?.message}</p>
      <a href={resolve('/')} class="mt-4 text-teal-400 underline">Voltar para a página inicial</a>
    </div>
    <MainFooter />
  </main>
</div>
