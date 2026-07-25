<script lang="ts">
    import type { Attachment } from "svelte/attachments";

	import arrowIcon from '$lib/assets/icons/arrow-right.svg';

	interface Props {
		months: Array<{ month: string, year: number }>,
		onMonthButtonClick: (month: string, year: number) => void
	};

	let { months, onMonthButtonClick }: Props = $props();
	let slider: HTMLElement;
	let selectedButton = $state('Jun2026');

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

	function monthButtonClick(month: string, year: number) {
		selectedButton = month + year.toString();
		onMonthButtonClick(month, year);
	}
</script>

<button type="button" onclick={() => { scrollHorizontal(slider, 'l') }} class="bg-stone-200 dark:bg-stone-700 rounded-l-xl p-2 cursor-pointer hover:bg-stone-300 dark:hover:bg-stone-600 transition hidden lg:inline">
	<img src={arrowIcon} alt="<" class="white-filter w-5 rotate-180">
</button>
  <div {@attach scrollToBottom} class="flex flex-1 bg-stone-200 dark:bg-stone-700 overflow-x-auto p-2 scrollbar-none gap-2 rounded-xl lg:rounded-none" bind:this={slider}>
      <div class="flex-[0_0_calc(50%-36px)]"></div>
      
      {#each months as { month, year } ((month + year.toString()))}
        <button
          type="button" 
          aria-label={month + year.toString()} 
          onclick={(event) => {monthButtonClick(month, year); event.currentTarget.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"});}} 
          class="flex-[0_0_80px] flex flex-col aspect-square items-center justify-center text-center {selectedButton === month + year.toString() ? 'text-teal-600 dark:text-teal-400 bg-[#ced1cf] dark:bg-[#515251] font-bold transform-[scale(1.1)] rounded mx-1 scroll-mx-1' : 'bg-stone-300 dark:bg-[#555555] cursor-pointer rounded-xl hover:bg-[#c8c5c3] dark:hover:bg-[#5d5d5d]'} transition-all transition-discrete"
          disabled={selectedButton === month + year.toString()}
        >
          <span class="text-lg">{month}.</span>
          <span class="text-sm">{year}</span>
        </button>
      {/each}

      <div class="flex-[0_0_calc(50%-36px)]"></div>
  </div>
  <button type="button" onclick={() => { scrollHorizontal(slider, 'r') }} class="bg-stone-200 dark:bg-stone-700 rounded-r-xl p-2 cursor-pointer hover:bg-stone-300 dark:hover:bg-stone-600 transition  hidden lg:inline">
	<img src={arrowIcon} alt="<" class="white-filter w-5">
  </button>