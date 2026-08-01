<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
  import MainFooter from '$lib/components/MainFooter.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <AdminHeader />
  <main class="flex flex-1 flex-col bg-[#efefef] px-2 lg:px-5 dark:bg-[rgb(43,43,42)]">
    <div class="flex h-full flex-1 flex-col bg-transparent py-5 text-stone-900 lg:px-15 lg:py-10 dark:text-white">
      {@render children()}
    </div>
    <MainFooter />
  </main>
</div>
