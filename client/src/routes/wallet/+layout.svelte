<script lang="ts">
    import MainFooter from "$lib/components/MainFooter.svelte";
    import MainHeader from "$lib/components/MainHeader.svelte";

    let { children } = $props();
</script>

<div class="flex flex-col min-h-screen">
	<MainHeader />
	<main class="bg-stone-200 dark:bg-[rgb(27,27,26)] flex-1 px-30 flex flex-col">
        {@render children()}
    </main>
    <MainFooter />
</div>