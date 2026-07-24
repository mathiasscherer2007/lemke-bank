<script lang="ts">
  import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

  let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <AdminHeader />
  <main class="flex flex-1 flex-col bg-[#f1f1f1] lg:px-5 dark:bg-[rgb(46,46,45)]">
    <div class="flex h-full flex-1 flex-col bg-[#f1f1f1] py-5 text-stone-900 lg:px-15 lg:py-10 dark:bg-[rgb(46,46,45)] dark:text-white">
      {@render children()}
    </div>
  </main>
</div>
