<script lang="ts">
    import type { Attachment } from "svelte/attachments";

  let selectedButton = $state('Abr2026');


  const months = [
    { label: "Jan", year: 2026 },
    { label: "Fev", year: 2026 },
    { label: "Mar", year: 2026 },
    { label: "Abr", year: 2026 },
  ];

  const scrollToBottom: Attachment = (element) => {
      element.scrollLeft = element.scrollWidth;
  };

  function handleMonthClick(month: string, year: number) {
    // TODO: fetch the month and year in the api
    console.log(month, year);
    selectedButton = month + year.toString();
  };

</script>

<svelte:head>
  <title>Extrato | LemkeBank</title>
</svelte:head>

<div {@attach scrollToBottom} class="flex bg-stone-700 overflow-x-auto p-2 scrollbar-thumb-stone-300 scrollbar-track-transparent gap-2 rounded-xl">
    <div class="flex-[0_0_calc(50%-38px)]"></div>
    
    {#each months as { label, year } ((label + year.toString()))}
      <button 
        type="button" 
        aria-label={label + year.toString()} 
        onclick={(event) => {event.currentTarget.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"}); handleMonthClick(label, year);}} 
        class="flex-[0_0_80px] flex flex-col aspect-square items-center justify-center text-center bg-stone-600 cursor-pointer {selectedButton === label + year.toString() ? 'text-teal-400 transform-[scale(1.1)] shadow-lg rounded mx-1' : 'rounded-xl'} transition-all transition-discrete"
      >
        <span class="text-lg">{label}.</span>
        <span class="text-sm">{year}</span>
      </button>
    {/each}

    <div class="flex-[0_0_calc(50%-38px)]"></div>
</div>
