<script lang="ts">
    import { resolve } from "$app/paths";

	let { link, icon, title } = $props()
</script>

<a
	href={resolve(link)}
	class="m-1 lg:m-3 flex aspect-square flex-col items-center justify-center rounded-xl border border-black p-2 text-center transition hover:border-teal-500 dark:border-white dark:bg-[#282828] dark:hover:border-teal-400"
>
	<figure class="w-7/11 p-2 lg:p-3 white-filter">
	<img
		src={icon}
		alt={title}
	/>
	</figure>
	<p class="my-auto mx-1 ext-center">{title}</p>
</a>