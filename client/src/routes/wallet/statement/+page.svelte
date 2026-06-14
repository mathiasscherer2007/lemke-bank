<script lang="ts">
  import type { Attachment } from "svelte/attachments";

  let selectedButton = $state('Abr2026');
  let slider: HTMLElement;

  const months = [
    { label: "Jan", year: 2026 },
    { label: "Fev", year: 2026 },
    { label: "Mar", year: 2026 },
    { label: "Abr", year: 2026 },
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
  }

  function handleMonthClick(month: string, year: number) {
    // TODO: fetch the month and year in the api
    console.log(month, year);
    selectedButton = month + year.toString();
  };

</script>

<svelte:head>
  <title>Extrato | LemkeBank</title>
</svelte:head>

<h1 class="font-['Stack_Sans_Headline'] text-3xl ml-3 mb-3">Extrato</h1>
<div class="flex w-full gap-2">
  <button type="button" onclick={() => { scrollHorizontal(slider, 'l') }} class="bg-stone-700 rounded-tl-xl rounded-bl-xl p-3 cursor-pointer hover:bg-stone-600 transition">◀</button>
  <div {@attach scrollToBottom} class="flex flex-1 bg-stone-700 overflow-x-auto p-2 scrollbar-thumb-stone-300 scrollbar-none gap-2" bind:this={slider}>
      <div class="flex-[0_0_calc(50%-36px)]"></div>
      
      {#each months as { label, year } ((label + year.toString()))}
        <button
          type="button" 
          aria-label={label + year.toString()} 
          onclick={(event) => {event.currentTarget.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"}); handleMonthClick(label, year);}} 
          class="flex-[0_0_80px] flex flex-col aspect-square items-center justify-center text-center bg-stone-600 {selectedButton === label + year.toString() ? 'text-teal-400 transform-[scale(1.1)] shadow-lg rounded mx-1' : 'cursor-pointer rounded-xl hover:bg-[#5d5d5d]'} transition-all transition-discrete"
          disabled={selectedButton === label + year.toString()}
        >
          <span class="text-lg">{label}.</span>
          <span class="text-sm">{year}</span>
        </button>
      {/each}

      <div class="flex-[0_0_calc(50%-36px)]"></div>
  </div>
  <button type="button" onclick={() => { scrollHorizontal(slider, 'r') }} class="bg-stone-700 rounded-tr-xl rounded-br-xl p-3 cursor-pointer hover:bg-stone-600 transition">▶</button>
</div>