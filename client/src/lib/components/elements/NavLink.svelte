<script lang="ts">
  import arrowRight from '$lib/assets/icons/arrow-right.svg';

  let { link, icon, title }: { link: string; icon: string; title: string } = $props();
</script>

<a
  href={link}
  class="group flex h-full lg:h-auto rounded-xl border border-black p-2 lg:p-3 transition hover:border-teal-500 dark:border-white dark:bg-[#282828] dark:hover:border-teal-400"
>
	<span class="flex-1 flex flex-col lg:flex-row items-center gap-2 lg:gap-3 aspect-square lg:aspect-auto">
		<img src={icon} alt={title} class="aspect-square w-12 lg:w-1/5 max-w-20 white-filter lg:p-3" />
		<p class="flex-1 flex lg:inline items-center justify-center lg:text-lg font-semibold text-center lg:text-left">{title}</p>
	</span>
	<img
		src={arrowRight}
		alt=""
		class="hidden lg:inline w-1/11 white-filter transition group-hover:teal-filter lg:w-1/10 max-w-11"
	/>
</a>
