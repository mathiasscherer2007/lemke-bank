<script lang="ts">
  import type { Snippet } from 'svelte';

  let { columns, children }: { columns?: number; children?: Snippet } = $props();
</script>

<div class="dynamic-grid" style="--columns: {columns}">
  {@render children?.()}
</div>

<style>
  .dynamic-grid {
    display: grid;
    /* Default: 1 column on mobile screens */
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  /* Tablet screens (768px and up) */
  @media (min-width: 768px) {
    .dynamic-grid {
      grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    }
  }
</style>
