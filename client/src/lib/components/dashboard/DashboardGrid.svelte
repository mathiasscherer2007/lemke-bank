<script lang="ts">
    import type { Snippet } from "svelte";

	let { columns, gap, children }: { columns?: number, gap?: string, children?: Snippet} = $props()
</script>

<div class="grid" style="grid-template-columns: repeat({columns}, minmax(0, 1fr)); gap: {gap}">
	{@render children?.()}
</div>