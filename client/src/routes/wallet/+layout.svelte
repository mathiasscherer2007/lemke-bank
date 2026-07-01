<script lang="ts">
  import MainFooter from '$lib/components/MainFooter.svelte';
  import MainHeader from '$lib/components/MainHeader.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <MainHeader />
  <main class="flex flex-col flex-1 bg-stone-100 lg:px-20 dark:bg-[rgb(36,36,35)]">
    <div class="flex flex-col flex-1 h-full px-5 lg:px-15 py-10 text-stone-900 bg-[#fbfafb] dark:bg-[rgb(46,46,45)] dark:text-white">
      {@render children()}
    </div>
  </main>
  <MainFooter />
</div>
