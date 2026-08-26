<script lang="ts">
  import { numberToMonth } from '$lib/utils/date-utils';
  import type { PageProps } from './$types';
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';

  import MonthSlider from '$lib/components/elements/MonthSlider.svelte';

  import arrowinIcon from '$lib/assets/icons/arrow-in.svg';
  import arrowoutIcon from '$lib/assets/icons/arrow-out.svg';

  let { data, form }: PageProps = $props();
  let months: Array<{ month: string, year: number, endpoint: string | URL }> = $state([]);

  onMount(() => {
    data.links.forEach((l: string) => {
      const link = new URL(l);
      const month = numberToMonth(Number(link.searchParams.get('month') ?? 0), true);
      const year = Number(link.searchParams.get('year'));

      months.unshift({
        month: month,
        year: year,
        endpoint: link
      });
    });
  });
</script>

<svelte:head>
  <title>Histórico de Transferências | LemkeBank</title>
</svelte:head>

<h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl lg:ml-3">Histórico de Transferências</h1>
<div class="flex w-full gap-2">
  <MonthSlider {months} buttonFormAction="?/getMonthStatement" selectedButton={form?.selectedButton ?? ''} />
</div>

{#snippet transfer(
  type: 'credit' | 'debit',
  title: string,
  amount: string,
  description?: string | Array<string>
)}
  <div class="flex gap-2 bg-[#dddddd50] px-2 py-3 dark:bg-neutral-700">
    <div class="flex flex-col justify-evenly gap-2">
      <figure class="h-7 w-7 p-1 {type == 'credit' ? 'green-filter' : 'red-filter'}">
        <img src={type == 'credit' ? arrowinIcon : arrowoutIcon} alt={type} />
      </figure>
      <div class="mx-auto min-w-0.5 flex-1 rounded-xl bg-neutral-400"></div>
    </div>
    <div class="ml-1 flex flex-col gap-1">
      <span class="m-0 text-xl">{title.toUpperCase()}</span>
      {#if typeof description === 'string'}
        <span class="text-md text-neutral-600 italic dark:text-neutral-300">{description ?? ''}</span>
      {:else}
        <details class="transition">
          <summary class="text-md text-neutral-600 italic dark:text-neutral-300">{description?.length} recebedores</summary>
		  <div class="grid grid-rows-5 auto-cols-fr grid-flow-col gap-1 pl-2 ml-1.25 py-1.25 border-l-2 border-neutral-400 bg-[#00000020] rounded-r-lg">
          {#each description as name, index (index)}
            <p class="ml-3">{name}</p>
          {/each}
		  </div>
        </details>
      {/if}
      <span class="text-lg font-bold">BL$ {amount}</span>
    </div>
  </div>
{/snippet}

<div>
  <ol in:slide class="mt-3 flex flex-col gap-1">
    <li class="bg-[#bbbbbb95] p-2 text-lg font-bold dark:bg-neutral-800">25/03</li>
    {@render transfer(
      'debit', 
      'atividade de números binários', 
      '10', 
      [
        'Mathias Scherer', 'Nícolas Kochhann', 
        'Thaila Jesus', 'Paulo Nunes', 
        'Leonardo Hoffmann', 'Marcelo Freitas', 
        'Michael Jackson'
      ]
    )}
    <li class="bg-[#bbbbbb95] p-2 text-lg font-bold dark:bg-neutral-800">24/03</li>
    {@render transfer('credit', '2 questões da prova', '15', 'Mathias Scherer')}
  </ol>
</div>
