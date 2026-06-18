<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Erro | LemkeBank</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
  <main class="flex flex-1 flex-col bg-white dark:bg-[rgb(27,27,26)]">
    <div class="relative flex flex-col items-center justify-center flex-1 px-10 lg:px-15 py-10 text-stone-900 bg-teal-50/25 dark:bg-[rgb(45,46,45)] dark:text-white">
      <h2 class="absolute left-5 top-5 text-teal-500 dark:text-teal-400 font-[Stack_Sans_Notch] text-3xl lg:text-4xl">Lemke<b>Bank</b></h2>
      <h1 class="font-bold text-3xl italic">Oops!</h1>
      <h2 class="text-3xl font-semibold mb-4">{page?.status} - {page?.error?.message}</h2>
      <p class="italic lg:max-w-2/3 text-center">
        {#if page?.status === 404}
          Página não encontrada. Talvez ela tenha sido movida ou o link está quebrado.
        {:else if page?.status === 500}
          Ocorreu um erro no servidor. Tente novamente mais tarde.
        {/if}
      </p>
      <a href={resolve('/')} class="mt-4 text-teal-500 dark:text-teal-400 font-semibold underline">Voltar para a página inicial</a>
    </div>
  </main>
</div>
