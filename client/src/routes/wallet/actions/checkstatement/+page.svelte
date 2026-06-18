<script lang="ts">
  import type { Attachment } from "svelte/attachments";

  import arrowinIcon from '$lib/assets/icons/arrow-in.svg';
  import arrowoutIcon from '$lib/assets/icons/arrow-out.svg';
    import { slide } from "svelte/transition";

  let selectedButton = $state('Jun2026');
  let slider: HTMLElement;

  const months = [
    { label: "Jan", year: 2026 },
    { label: "Fev", year: 2026 },
    { label: "Mar", year: 2026 },
    { label: "Abr", year: 2026 },
    { label: "Mai", year: 2026 },
    { label: "Jun", year: 2026 },
  ];

  const scrollToBottom: Attachment = (element) => {
      element.scrollLeft = element.scrollWidth;
  };

  function scrollHorizontal(target: HTMLElement, direction: string) {
    if (direction === 'r') {
      target.scrollBy({ left: 100, behavior: 'smooth' });
    } else {
      target.scrollBy({ left: -100, behavior: 'smooth' });
    };
  };

  function handleMonthClick(month: string, year: number) {
    // TODO: fetch the month and year in the api
    selectedButton = month + year.toString();
  };

</script>

<svelte:head>
  <title>Extrato | LemkeBank</title>
</svelte:head>

<h1 class="font-[Stack_Sans_Headline] text-3xl lg:ml-3 mb-3">Extrato</h1>
<div class="flex w-full gap-2">
  <button type="button" onclick={() => { scrollHorizontal(slider, 'l') }} class="bg-stone-200 dark:bg-stone-700 rounded-l-xl p-3 cursor-pointer hover:bg-stone-300 dark:hover:bg-stone-600 transition hidden lg:inline">&lt;</button>
  <div {@attach scrollToBottom} class="flex flex-1 bg-stone-200 dark:bg-stone-700 overflow-x-auto p-2 scrollbar-none gap-2 rounded-xl lg:rounded-none" bind:this={slider}>
      <div class="flex-[0_0_calc(50%-36px)]"></div>
      
      {#each months as { label, year } ((label + year.toString()))}
        <button
          type="button" 
          aria-label={label + year.toString()} 
          onclick={(event) => {handleMonthClick(label, year); event.currentTarget.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"});}} 
          class="flex-[0_0_80px] flex flex-col aspect-square items-center justify-center text-center {selectedButton === label + year.toString() ? 'text-teal-600 dark:text-teal-400 bg-[#ced1cf] dark:bg-[#515251] font-bold transform-[scale(1.1)] rounded mx-1 scroll-mx-1' : 'bg-stone-300 dark:bg-[#555555] cursor-pointer rounded-xl hover:bg-[#c8c5c3] dark:hover:bg-[#5d5d5d]'} transition-all transition-discrete"
          disabled={selectedButton === label + year.toString()}
        >
          <span class="text-lg">{label}.</span>
          <span class="text-sm">{year}</span>
        </button>
      {/each}

      <div class="flex-[0_0_calc(50%-36px)]"></div>
  </div>
  <button type="button" onclick={() => { scrollHorizontal(slider, 'r') }} class="bg-stone-200 dark:bg-stone-700 rounded-r-xl p-3 cursor-pointer hover:bg-stone-300 dark:hover:bg-stone-600 transition  hidden lg:inline">&gt;</button>
</div>

<div>
  <ol in:slide class="mt-3 flex flex-col gap-1">
    <li class="bg-[#bbbbbb95] dark:bg-stone-800 p-2 text-lg font-bold">25/03</li>
    <ul>
      <li class="bg-[#dddddd50] dark:bg-stone-700 flex gap-2 px-2 py-3">
        <div class="flex flex-col gap-2 justify-evenly">
          <figure class="h-7 w-7 p-1 green-filter">
            <img src={arrowinIcon} alt="Entrada" />
          </figure>
          <div class="flex-1 bg-stone-400 min-w-0.5 mx-auto rounded-xl"></div>
        </div>
        <div class="flex flex-col gap-1 ml-1">
          <span class="text-xl m-0">ANA PAULA LEMKE</span>
          <span class="italic text-md text-stone-600 dark:text-stone-300">Atividade de números binários</span>
          <span class="text-lg font-bold">BL$ 10</span>
        </div>
      </li>
    </ul>
    <li class="bg-[#bbbbbb95] dark:bg-stone-800 p-2 text-lg font-bold">24/03</li>
    <ul>
      <li class="bg-[#dddddd50] dark:bg-stone-700 flex gap-2 px-2 py-3">
        <div class="flex flex-col gap-2 justify-evenly">
          <figure class="h-7 w-7 p-1 red-filter">
            <img src={arrowoutIcon} alt="Saída" />
          </figure>
          <div class="flex-1 bg-stone-400 min-w-0.5 mx-auto rounded-xl"></div>
        </div>
        <div class="flex flex-col gap-1 ml-1">
          <span class="text-xl m-0">TÚLIO LIMA BASÉGIO</span>
          <span class="italic text-md text-stone-300"></span>
          <span class="text-lg font-bold">-BL$ 6</span>
        </div>
      </li>
    </ul>
  </ol>
</div>