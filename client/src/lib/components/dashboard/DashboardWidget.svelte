<script lang="ts">
  import type { Snippet } from 'svelte';

  let { title, span = 1, content }: { title?: string; span?: number; content?: Snippet } = $props();
</script>

<div class="flex flex-col border rounded-lg px-3 py-2" style="grid-column: span {span}/span {span};">
  <h3 class="text-lg font-semibold">{title}</h3>
  <div class="flex-1 flex items-center justify-center">
    {@render content?.()}
  </div>
</div>
