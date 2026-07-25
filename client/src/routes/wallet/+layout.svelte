<script lang="ts">
  import MainFooter from '$lib/components/MainFooter.svelte';
  import MainHeader from '$lib/components/MainHeader.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <MainHeader />
  <main class="flex flex-col flex-1 bg-[#f1f1f1] px-2 lg:px-5 dark:bg-[rgb(46,46,45)]">
    <div class="flex flex-col flex-1 h-full px-3 lg:px-15 py-5 lg:py-10 text-stone-900 bg-[#f1f1f1] dark:bg-[rgb(46,46,45)] dark:text-white">
      {@render children()}
    </div>
    <MainFooter />
  </main>
</div>
