<script lang="ts">
    import type { Attachment } from "svelte/attachments";
	import { enhance } from "$app/forms";

	import arrowIcon from "$lib/assets/icons/arrow-right.svg";

	interface Props {
		months: Array<{ month: string, year: number, endpoint: string | URL }>,
		buttonFormAction: string,
		selectedButton: string
	};

	let { months, buttonFormAction, selectedButton }: Props = $props();
	let slider: HTMLElement;

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
</script>

<button type="button" onclick={() => { scrollHorizontal(slider, 'l') }} class="bg-neutral-200 dark:bg-neutral-700 rounded-l-xl p-2 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 transition hidden lg:inline">
	<img src={arrowIcon} alt="<" class="white-filter w-5 rotate-180">
</button>
  <div {@attach scrollToBottom} class="flex flex-1 bg-neutral-200 dark:bg-neutral-700 overflow-x-auto p-2 scrollbar-none gap-2 rounded-xl lg:rounded-none" bind:this={slider}>
      <div class="flex-[0_0_calc(50%-36px)]"></div>
      
      {#each months as { month, year, endpoint } ((month + year.toString()))}
	  	<form action={buttonFormAction} method="POST" use:enhance class="h-20 flex-[0_0_80px] flex bg-red-50">
			<input type="hidden" name="endpoint" value={endpoint}>
			<button
			type="submit" 
			value={`${month}-${year}`} 
			name="monthYear"
			onclick={(event) => {event.currentTarget.scrollIntoView({behavior: "smooth", inline: "center", block: "nearest"})}} 
			class="flex-1 flex flex-col aspect-square items-center justify-center text-center {`${month}-${year}` === selectedButton ? 'text-teal-600 dark:text-teal-400 bg-[#ced1cf] dark:bg-[#515251] font-bold transform-[scale(1.1)] rounded mx-1 scroll-mx-1' : 'bg-neutral-300 dark:bg-[#555555] cursor-pointer rounded-xl hover:bg-[#c8c5c3] dark:hover:bg-[#5d5d5d]'} transition-all transition-discrete"
			disabled={`${month}-${year}` === selectedButton}
			>
				<span class="text-lg">{month}.</span>
				<span class="text-sm">{year}</span>
			</button>
		</form>
      {/each}

      <div class="flex-[0_0_calc(50%-36px)]"></div>
  </div>
  <button type="button" onclick={() => { scrollHorizontal(slider, 'r') }} class="bg-neutral-200 dark:bg-neutral-700 rounded-r-xl p-2 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 transition  hidden lg:inline">
	<img src={arrowIcon} alt="<" class="white-filter w-5">
  </button>