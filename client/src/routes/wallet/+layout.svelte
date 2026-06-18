<script lang="ts">
  import MainFooter from '$lib/components/MainFooter.svelte';
  import MainHeader from '$lib/components/MainHeader.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <MainHeader />
  <main class="flex flex-1 flex-col bg-stone-200 lg:px-20 dark:bg-[rgb(27,27,26)]">
    <div class="flex-1 px-5 lg:px-15 py-10 text-stone-900 bg-[#fbfafb] dark:bg-[rgb(46,46,45)] dark:text-white">
      {@render children()}
    </div>
  <MainFooter />
  </main>
  
</div>
