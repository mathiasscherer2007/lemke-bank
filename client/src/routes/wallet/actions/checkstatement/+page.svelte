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
  <title>Extrato | LemkeBank</title>
</svelte:head>

<h1 class="mb-3 font-[Stack_Sans_Headline] text-3xl lg:ml-3">Extrato</h1>
<div class="flex w-full gap-2">
  <MonthSlider {months} buttonFormAction="?/getMonthStatement" selectedButton={form?.selectedButton ?? ''} />
</div>

{#snippet transfer(type: 'credit' | 'debit', title: string, amount: string, description?: string)}
  <div class="flex gap-2 bg-[#dddddd50] px-2 py-3 dark:bg-neutral-700 rounded">
    <div class="flex flex-col justify-evenly gap-2">
      <figure class="h-7 w-7 p-1 {type == 'credit' ? 'green-filter' : 'red-filter'}">
        <img src={type == 'credit' ? arrowinIcon : arrowoutIcon} alt={type} />
      </figure>
      <div class="mx-auto min-w-0.5 flex-1 rounded-xl bg-neutral-400"></div>
    </div>
    <div class="ml-1 flex flex-col gap-1">
      <span class="m-0 text-xl font-semibold">{title.toUpperCase()}</span>
      <span class="text-md text-neutral-600 italic dark:text-neutral-300">{description ?? 'Nenhuma descrição fornecida.'}</span>
      <span class="text-lg font-bold">{type === 'debit' ? '-' : ''}BL$ {amount}</span>
    </div>
  </div>
{/snippet}

<ol class="mt-3 flex flex-col gap-1">
  {#if form?.transactions.length > 0}
    {console.log("yep")}
    {#each form?.transactions as { date, transactions }, index (index)}
      <details open in:slide|global class="bg-[#bbbbbb95] text-lg font-bold dark:bg-neutral-800 rounded">
        <summary class="p-2">{date}</summary>
        <div class="flex flex-col gap-1 font-normal">
          {#each transactions as { totalAmount, entries, description, transactionId } (transactionId)}
            {@render transfer(entries[0].type, entries[0].relatedUser.username, totalAmount, description ?? '')}
          {/each}
        </div>
      </details>
    {/each}
  {:else}
    <p class="mt-5 text-xl opacity-80">Não houveram movimentações no período selecionado.</p>
  {/if}
</ol>
